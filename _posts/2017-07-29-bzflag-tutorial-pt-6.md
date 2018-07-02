---
title: "BZFlag Plug-ins for Dummies: Chapter 6"
date: 2017-07-29 00:00:00.00 -8
anthology:
  name: BZFlag Plug-ins for Dummies
  type: chapter
  chapter: 6
  summary: Making URL Calls
categories:
  - tutorials
tags:
  - bzflag
  - plugins
  - development
---

In honor of my latest commit, of adding a new parameter to `bz_addURLJob()`, this chapter will be covering making URL requests and handling the return data. Why would a plug-in need to make URL calls? Well, a plug-in may need to communicate with an API but don't expect instant results, there'll be a small delay. A common plug-in that makes use of API calls would be my own League Overseer, which communicates with the league's API to report matches automatically. There are two different ways of doing URL jobs in a plug-in.

1. Create the URL job and forget about it, meaning you don't care about the results returned by the website you're calling
2. Create the URL job and execute code based on the returned data from the website

We'll be handling both situations in this chapter. If your plug-in will be working with the returned data, you will need to extend the abstract class, `bz_URLHandler_V2`. By extending this abstract class, you will have to implement 3 methods:

- `URLDone()` - This method is called whenever a URL job is completed.
- `URLTimeout()` - This method is called when a URL job times out.
- `URLError()` - This method is called when a URL job results in an error.

```cpp
class SAMPLE_PLUGIN : public bz_Plugin, public bz_URLHandler_V2
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData);

    // Virtual methods from `bz_URLHandler_V2`
    virtual void URLDone (const char* URL, const void* data, unsigned int size, bool complete);
    virtual void URLTimeout (const char* URL, int errorCode);
    virtual void URLError (const char* URL, int errorCode, const char *errorString);
};
```

## Making the URL Calls

When making URL calls, you'll be using the `bz_addURLJob()` function anywhere in your plug-in but don't expect instant results. Oh, and don't worry about pausing execution while waiting for a response, the game and code will go on<sup>1</sup>. Here's the definition of the function we'll be using and its parameters:

```cpp
bool bz_addURLJob(const char* URL, bz_URLHandler_V2* handler, void* token, const char* postData = NULL, bz_APIStringList *headers = NULL);
```

Name | Description
---- | -----------
URL  | The URL you'll be making the call to
handler | The class which implements the callbacks needed to handle returned data
token | A way to keep track of which job is which when running multiple
postData | An ampersand delimited and URL encoded list of data that will be used as POST data
headers | An array of HTTP headers that will be used in your URL call

**Notes**

1. This does not imply threads or asynchronous behavior. Your plug-in is still running in the main server loop so be efficient.

## URL Calls without Callbacks

Let's consider a plug-in that will record player joins and send the data to a website to log players' online status, similar to Strayer's bzstats but this'd be real-time since it'd report player activity as it happens. We won't care about the data that was returned in this particular situation so we won't worry about specifying a handler, we'll leave it as `NULL`.

The first parameter of the function is a URL, this is the URL we'll be sending the data to. The second important bit is the data that we'll be sending as POST data, as we typically would: delimited by ampersands and URL encoded values.

```
argumentOne=hello%20world&argumentTwo=10
```

We will have to build the POST data ourselves and give it to our function to send in the URL job. We will be providing all of the formatting ourselves (ampersands and equal signs) and we need to make sure we encode all of our values so nothing breaks. To encode our values, `bz_urlEncode()` is provided but it expects a `const char*` so we'll be doing a lot of casting so we can continue to work with objects instead of pointers.

```cpp
case bz_ePlayerJoinEvent:
{
    bz_PlayerJoinPartEventData_V1 *data = (bz_PlayerJoinPartEventData_V1*)eventData;
    
    std::string urlQuery;
    urlQuery += "callsign=" + std::string(bz_urlEncode(data->record->callsign.c_str()));
    urlQuery += "&bzID=" + std::string(bz_urlEncode(data->record->bzID.c_str()));

    // urlQuery -> "callsign=allejo%20bot&bzID=12345"

    bz_addURLJob("http://localhost/api/?report=join", NULL, NULL, urlQuery.c_str());
}
break;
```

We leave both the `handler` and `token` parameters as `NULL` since we don't care about whatever comes back from the URL. It could fail and burn for all we care.

## URL Calls with Callbacks

Ok, what about if we *do* care about things failing and burning? Or what if we need the data returned from the URL? As an example, League Overseer expects to receive information back from the league website; it expects to get team information or the results of a match report. We work with the returned data in our `URLDone()` implementation.

Similar to our handling of slash commands, we'll comment out some of the parameters we won't actually use to prevent warnings about unused variables; we only really care about `*data` and `complete`.

In this case, the data we'll be receiving from the URL we called will be text, so we will cast it to a `const char*` and assign that value to an `std::string` to allow for easier manipulation in the future. The logic is left up to you to implement. You can output it to all the users with `bz_sendTextMessage()`, store it in an array, or [just discard it and drive into walls](http://bash.org/?240849).

```cpp
void SAMPLE_PLUGIN::URLDone(const char* /*URL*/, const void *data, unsigned int /*size*/, bool complete)
{
    std::string webData = (const char*)data;

    if (complete)
    {
        // ...your own logic
    }
}
```

Most APIs nowadays supports returning data as JSON, so if you'd like to use parse and work with JSON, I've already set the ground work for it. If you use [json-c](https://github.com/json-c/json-c), you'll likely have good support since it's available on most \*nix distributions (`libjson0-dev` in Debian/Ubuntu; `json-c-devel` in Fedora Linux) and should already be installed by server owners who run league servers (League Overseer requires it). To make your life *even* easier, I've written a thin wrapper on top of json-c that'll save you the effort of using its complicated and tedious API: [JSONObject](https://github.com/allejo/JsonObject).

You're welcome.

## Using HTTP Headers

Some APIs require keys or tokens to be passed through HTTP headers, and as of today, the BZFS API supports sending headers in your URL jobs.

The first step is to create a `bz_APIStringList` pointer somewhere; I'd recommend declaring it in the class definition, initialize it when you configure your headers, and free it in `URLDone()`.

- If we free the list *before* `URLDone()` is called, you'll likely get a segmentation fault.
- If you never delete it, you'll likely get a memory leak.
- If you don't use `bz_newStringList()` and use a reference instead, your plug-in won't work on Windows.

```cpp
bz_APIStringList *headers = bz_newStringList(); // Remember to free this!
```

Once we've created the string list pointer, we'll be able to set and modify headers as we please. This functionality follows the same practice as libcurl's for simplicity and familiarity.

```cpp
// Remove a header curl would otherwise add by itself
headers->push_back((std::string)"Accept:");

// Add a custom header
headers->push_back((std::string)"X-ApiKey: MySuperSecretAwesomeAPIKey");

// Modify a header curl otherwise adds differently
headers->push_back((std::string)"Cache-Control: no-cache");
headers->push_back((std::string)"Host: example.com");

// Add a header with "blank" contents to the right of the colon. Note that
//    we're then using a semicolon in the string we pass to curl!
headers->push_back((std::string)"X-silly-header;");

// Make the URL call
bz_addURLJob("api.example.com", NULL, NULL, NULL, headers);
```

## Conclusion

I apologize that this chapter didn't have a complete plug-in that we built together but I couldn't think of a quick and easy to plug-in to write that used public APIs. Depending on the demand, I may revisit this chapter with a more in-depth tutorial about using APIs and parsing JSON. However, I believe I've covered enough for you to be able to make use of URL jobs and use the returned data in conjunction with what you've learned in the previous chapters.
