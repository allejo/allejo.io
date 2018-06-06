---
title: "BZFlag Plug-ins for Dummies: Chapter 5"
date: 2017-07-08 00:00:00.00 -8
anthology: BZFlag Plug-ins for Dummies
categories:
  - tutorials
tags:
  - bzflag
  - plugins
  - development
---

After last week's pretty long chapter, this'll be shorter in comparison. So far we've written simple plug-ins where the behavior we define is all the behavior the plug-in gets. But what if we want to allow the server owners or map makers to control the behavior of the plug-ins. This can be done in several ways but in this chapter, we'll be covering using configuration files.

So what do configuration files look like?

```ini
[pluginname]
    setting1 = my value 1
    setting2 = another value
```

The API provides a `PluginConfig` object, which is available through the `plugin_config.h` header and this is what we use to parse configuration files for us.

## Setup

When plug-ins are loaded, you can pass one parameter to it when you load it either via `-loadplugin` or `/loadplugin`.

```
-loadplugin messengerPlugin,/path/to/configuration.cfg
```

The value passed at load time is accessible to us in the `Init()` method as the `config` parameter. We can advantage of this functionality to expect the path to a configuration file when the plug-in is loaded. Personally, I like to keep all of the logic for parsing configuration files and setting things up in its own dedicated method so I create `loadConfiguration()`. I declare it in the plug-in's class definition and call it in the `Init()` method.

> **Tip:** If you'd like to reload the configuration while the plug-in is loaded, be sure to save the `config` value as an instance variable in the class.

```cpp
class Messenger : public bz_Plugin
{
    // ...
    virtual void loadConfiguration (const char* config);
};

void Messenger::Init (const char* config)
{
    // config = "/path/to/configuration.cfg"
    loadConfiguration(config);
}
```

## Plug-in Specification

Now that we have declared the function and are using it, let's define what we need it to do. Now `PluginConfig` only works with strings but our configuration file will need to support booleans and integers too.

> **Heads up!** Do not use quotes in your configuration file unless you would like a literal quote in the value.

```ini
[messenger]
    DEBUG_LEVEL = 0
    SEND_MESSAGES = true
    WELCOME_MESSAGE = Welcome to this server
    CAPTURE_MESSAGE = Yay someone captured...
```

In this plug-in that we're building, here's is what each configuration option is going to do:

| Name | Description |
| ---- | ----------- |
| DEBUG_LEVEL | The default debug level that will be used in `bz_debugMessage()` function calls |
| SEND_MESSAGES | Set to false to disable the plug-in entirely |
| WELCOME_MESSAGE | A message sent to players when they join |
| CAPTURE_MESSAGE | A message sent to everyone when someone captures |

As I mentioned, all of our logic will be defined in `loadConfiguration()` because it's a good idea to keep things together. Additionally, we can implement functionality to reload the configuration file while the plug-in is loaded.

Let's start our `loadConfiguration()` method by creating a `PluginConfig` object, defining the section we'll be reading, and exit out if there are any errors reading the configuration file.

```cpp
void Messenger::loadConfiguration (const char* configPath)
{
    PluginConfig config = PluginConfig(configPath);
    std::string section = "messenger";

    if (config.errors)
    {
        bz_debugMessage(0, "Your configuration file has errors");
        return;
    }
}
```

After we've created the parser and checked for errors, we can start working with the data from the configuration file but first, we need a place to store all of that data. Now, remember the previous chapter where we discussed stateful data? We'll be storing configuration data the same way. Let's create some instance variables in our plug-in's class to store the information we get from our configuration file.

```cpp
class Messenger : public bz_Plugin
{
    // ...
    virtual void loadConfiguration (const char* config);

    // Plug-in configuration
    int DEBUG_LEVEL;
    bool SEND_MESSAGES;
    std::string WELCOME_MESSAGE, CAPTURE_MESSAGE;
};
```

Now that we have a place to store the information, let's start pulling information from our configuration file. Our `PluginConfig` has an `item()` method that we use to pull values. You may be wondering why our variables are uppercase, well that's just a convention I follow so I can easily tell what variables pertain to a configuration option and which don't. Pulling strings from the configuration file is easy, as seen below.

```cpp
void Messenger::loadConfiguration (const char* configPath)
{
    // ...

    WELCOME_MESSAGE = config.item(section, "WELCOME_MESSAGE");
    CAPTURE_MESSAGE = config.item(section, "CAPTURE_MESSAGE");
}
```

However, pulling booleans or integers... Well that will require some conversion/logic on our part.

```cpp
void Messenger::loadConfiguration (const char* configPath)
{
    // ...

    // Use std::stoi for string to int conversion
    try
    {
        DEBUG_LEVEL = std::stoi(config.item(section, "DEBUG_LEVEL"));
    }
    catch (std::exception &e) {}

    // Use a comparison for booleans
    std::string _sendMessages = bz_tolower(config.item(section, "SEND_MESSAGES").c_str());
    SEND_MESSAGES = (_sendMessages == "true");
}
```

As you can see, parsing a configuration file and saving the values takes a lot of work and it should belong in its own method so it can be used easily. For example, if you'd like to build in a `/reload` option for reparsing the configuration file, you can simply call this function instead of doing all the work several times.

## Our Plug-in

Here's the majority of the plug-in we've built in this chapter. Read on to the conclusion to see which part is missing and why.

```cpp
#include "bzfsAPI.h"
#include "plugin_config.h"

class Messenger : public bz_Plugin
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData);

    virtual void loadConfiguration (const char* config);

    // Plug-in configuration
    int DEBUG_LEVEL;
    bool SEND_MESSAGES;
    std::string WELCOME_MESSAGE, CAPTURE_MESSAGE;
};

BZ_PLUGIN(Messenger)

const char* Messenger::Name ()
{
    return "Messenger";
}

void Messenger::Init (const char* config)
{
    loadConfiguration(config);

    Register(bz_eCaptureEvent);
    Register(bz_ePlayerJoinEvent);
}

void Messenger::Cleanup ()
{
    Flush();
}

void Messenger::Event (bz_EventData* eventData)
{
    // Read the "On Your Own" section
}

void Messenger::loadConfiguration (const char* configPath)
{
    PluginConfig config = PluginConfig(configPath);
    std::string section = "messenger";

    if (config.errors)
    {
        bz_debugMessage(0, "Your configuration file has errors");
        return;
    }

    WELCOME_MESSAGE = config.item(section, "WELCOME_MESSAGE");
    CAPTURE_MESSAGE = config.item(section, "CAPTURE_MESSAGE");

    try
    {
        DEBUG_LEVEL = std::stoi(config.item(section, "DEBUG_LEVEL"));
    }
    catch (std::exception &e) {}

    std::string _sendMessages = bz_tolower(config.item(section, "SEND_MESSAGES").c_str());
    SEND_MESSAGES = (_sendMessages == "true");
}
```

## Conclusion

It's a good idea to allow map makers or server owners to customize the plug-in's functionality easily without having to recompile the entire plug-in each time you'd like to change the welcome message. It's a good idea to introduce a configuration file for plug-ins that have a lot of features or can be used in different settings.

### On Your Own

I've been doing my best to write these chapters in an order where you build on top last chapter's lesson. So this chapter's plug-in will be left for you to complete. The necessary events have already been registered in the `Init()` function. Your task for this week is to implement this plug-in's `Event()` method that will send the appropriate messages when a capture happens or a player joins.
