---
title: "BZFlag Plug-ins for Dummies: Chapter 1"
date: 2017-06-10 00:00:00.00 -8
anthology: BZFlag Plug-ins for Dummies
tags: bzflag plugins development
---

[Back in 2015]({{ url(collections.posts['2015-10-25-My-New-Series-BZFlag-Plugins-for-Dummies']) }}), I said I'd write this series. Well, here it is. Better late than never. Right?

BZFlag plug-ins are written in C++ and each plug-in is a class which extends the `bz_Plugin` base class. Moving forward in this tutorial, when the word "plug-in" is used, it refers to the class that defines the plug-in's functionality. For example, when I say there are three functions each plug-in must define I mean there are three functions that the plug-in's class must define. This should make sense as you continue to read further in this tutorial.

I have a built an [(opinionated) generator](https://bz-plugin-starter.projects.allejo.io/), which will build the skeleton of your plugin and will take care of all the configuration of everything. For the rest of this tutorial, I'll be relying heavily on this generator.

## Plug-in Core + Setup

The four functions that each plug-in must define are the following:

### `virtual const char* Name ();`

This function defines the name of the plugin and what will be returned in debug messages and when `/listplugins` is run.

### `virtual void Init (const char* config);`

This function is where all of the plug-in configuration is done and is the function that is called when the plug-in is loaded. In this function, we will need to do the following:

- Register which events we'll be listening to
- Register custom flags
- Register custom slash commands
- Register custom map objects

### `virtual void Cleanup ();`

This function is called whenever the plug-in is unloaded and is where you need to:

- Call the `Flush();` function (to unregister your event callbacks)
- Remove custom flags
- Remove custom slash commands
- Remove custom map objects

This function has a default implementation that calls `Flush();` automatically, however it's a good idea to always create this implementation so you don't forget remove custom registrations if you add any in the future of your plug-in development.

### `virtual void Event (bz_EventData* eventData);`

This function is where the main behavior (our callbacks) of the plug-in is written.

## API Events

BZFlag plug-ins work (mainly) by defining callbacks for specific events depending on the purpose of the plug-in. Plugins are not limited solely to events but in this first chapter, that's what we'll be covering. If you use the plug-in skeleton generator, you'll be able to check off which events you intend to use and it'll have documentation notes for you to use with what information is available in each event.

There are events available for the majority of things that happen on a server such as a player joining, leaving, dying, capturing a flag, etc. When you build your plug-in, you'll need to plan out which events you will need.

## Building a Plug-in with Notification Type Events

I will be taking you through on building a plug-in that will notify unregistered players why they cannot speak. This is a hypothetical plug-in that will be used on servers where only registered players are allowed to speak.

### 1. Naming Your Plug-in

What's in a name? This name will be used in debug messages and `/listplugins` so what you return is up to you. I've adopted the practice of using the following pattern in my plug-ins:

```
<Plug-in Name> <Major>.<Minor>.<Revision> (<Build>)
```

Why so explicit? My plug-ins are never perfect the first time around and I always add more features, so I'd like to know which version is currently loaded on a server.

```cpp
const char* ChatNotifier::Name ()
{
    return "Chat Notifier 1.0.0 (1)";
}
```

### 2. Registering Events

The first step in building the plug-in is to notify the server which events we'll be listening to when the plug-in is loaded. We do this in the `Init()` function and will register the events we want to listen to using the `Register()` function.

For this plug-in, we'll be listening to `bz_eRawChatMessageEvent`, which is called every time a player sends a message before any filtering and permission checks occur.

```cpp
void ChatNotifier::Init (const char* config)
{
    Register(bz_eRawChatMessageEvent);
}
```

### 3. Defining Behavior

After we've specified to the server that we want to listen to this event, we now have to define what needs to happen when that event is triggered; we do this in the `Event()` function. In this function, we'll be defining the behavior for **all** of the events we're listening to so I'll be using a switch block to handle the behavior for each event (only one event in this plug-in's case) but I can also use an if statement.

Using the plug-in generator, here's what I've got as the definition for our `Event()` function. For each event, we're given a `bz_EventData` object that we can cast into more specific objects based on the event. Some events are used for notification purposes only and do not have any objects you can cast `bz_EventData` to; for `bz_eRawChatMessageEvent`, we're given `bz_ChatEventData_V2`.

```cpp
void ChatNotifier::Event (bz_EventData* eventData)
{
    switch (eventData->eventType)
    {
        case bz_eRawChatMessageEvent:
        {
            bz_ChatEventData_V2 *data = (bz_ChatEventData_V2*)eventData;
            
            // Data
            // ----
            // (int)             from        - The player ID sending the message.
            // (int)             to          - The player ID that the message is to if the message is to an individual, or a broadcast. If the message is a broadcast the id will be BZ_ALLUSERS.
            // (bz_eTeamType)    team        - The team the message is for if it not for an individual or a broadcast. If it is not a team message the team will be eNoTeam.
            // (bz_ApiString)    message     - The filtered final text of the message.
            // (bz_eMessageType) messageType - The type of message being sent
            // (double)          eventTime   - The time of the event.
        }
        break;

        default: break;
    }
}
```

So here's the logic that we'll be following in this plug-in:

1. Get a player record for the player who sent the message
2. Does the record show the player is registered?
	1. If not, then send them a message
3. Delete the player record to free memory

```cpp
bz_ChatEventData_V2 *data = (bz_ChatEventData_V2*)eventData;
bz_BasePlayerRecord *pr = bz_getPlayerByIndex(data->from); // step 1

// step 2
if (!pr->verified) {
	// step 2.1
    bz_sendTextMessage(BZ_SERVER, data->from, "Register an account on forums.bzflag.org in order to talk.");
}

// step 3
bz_freePlayerRecord(pr);
```

Now, let's break things down further.

#### Step 1

If we want information regarding an individual player, we'll often need to create a [player record](https://wiki.bzflag.org/Bz_BasePlayerRecord) with the [bz_getPlayerIndex()](https://wiki.bzflag.org/Bz_getPlayerByIndex) function, which returns a pointer (so we'll need to free pointer this in step 3). In this case, we want to create a record for the player who sent the message and as we can tell from our handy documentation, `data->from` is the player ID who sent the message.

The player ID is not a universally unique ID for the player across all servers but it's unique to the player during their current session. Once a player leaves and someone else joins, the new player will likely take on this ID. If you'd like to uniquely identify **registered** players, use `pr->bzID`. You may also use `pr->ipAddress` to identify players uniquely to some extent (e.g. players on the same Wi-Fi network would share the same IP).

#### Step 2

Our player record has a boolean value `verified`, which is set to true if a player is registered and false otherwise. We use an if statement to check if a player is registered and negate that value.

#### Step 2.1

We use [bz_sendTextMessage()](https://wiki.bzflag.org/Bz_sendTextMessage) to send a message to the player who just tried to talk. The `BZ_SERVER` value is a constant available to plug-ins to trigger actions on behalf of the server. In this case, the server will be sending a private message to this user.

#### Step 3

Lastly, we need to free the player record we created in step 1 to free the memory we've been using; there's no garbage collector around here.

### 4. Cleaning Up

We need to define what needs to be cleaned up when the plug-in is unloaded. When a plug-in *only* registers event listeners, we simply call `Flush()`.

```cpp
void ChatNotifier::Cleanup ()
{
    Flush();
}
```

### 5. Final Plug-in

Here's what the final plug-in would look like with a special note about `BZ_PLUGIN()`.

```cpp
#include "bzfsAPI.h"

class ChatNotifier : public bz_Plugin
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData);
};

// This is a macro defined by the BZFS API which registers this plug-in. It's not
// a function, therefore the lack of semi-colon here is NOT a typo.
BZ_PLUGIN(ChatNotifier)

const char* ChatNotifier::Name ()
{
    return "Chat Notifier";
}

void ChatNotifier::Init (const char* config)
{
    Register(bz_eRawChatMessageEvent);
}

void ChatNotifier::Cleanup ()
{
    Flush();
}

void ChatNotifier::Event (bz_EventData* eventData)
{
    switch (eventData->eventType)
    {
        case bz_eRawChatMessageEvent:
        {
            bz_ChatEventData_V2 *data = (bz_ChatEventData_V2*)eventData;
            bz_BasePlayerRecord *pr = bz_getPlayerByIndex(data->from); // step 1

            // step 2
            if (!pr->verified) {
                // step 2.1
                bz_sendTextMessage(BZ_SERVER, data->from, "Register an account on forums.bzflag.org in order to talk.");
            }
				
            // step 3
            bz_freePlayerRecord(pr);
        }
        break;

        default: break;
    }
}
```

## Conclusion

Congratulations! You've just completed your very first BZFlag plug-in! Don't worry, there's a lot more of the API to cover and more posts to come; this time, the next post won't take another 2 years.

Your feedback is most welcome and appreciated! However, please do not request what you'd like to see written next. I'll be writing these posts in the order I deem best.
