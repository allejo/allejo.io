---
title: "BZFlag Plug-ins for Dummies: Chapter 2"
date: 2017-06-17 00:00:00.00 -8
anthology: BZFlag Plug-ins for Dummies
categories:
  - tutorials
tags:
  - bzflag
  - plugins
  - development
---

I told you it wouldn't take another 2 years until the next post. We're back and in this chapter we'll be discussing player records and modification API events.

Last week, I briefly mentioned [player records](https://wiki.bzflag.org/Bz_BasePlayerRecord) and the fact that they'll typically be used whenever we want information regarding a player on the server. Let's go over what information is available, how to create them, how to use them, and how to free them when we're done.

## Player Records

All player records are `bz_BasePlayerRecord` objects and they can either be created manually or are automatically given to you by the API. For example, the [`bz_ePlayerJoinEvent`](https://wiki.bzflag.org/Bz_ePlayerJoinEvent) has a `record` attribute that is automatically created and freed for you; however, the player record will only exist in the same scope of `*data` as seen in the snippet below.

```cpp
case bz_ePlayerJoinEvent:
{
    bz_PlayerJoinPartEventData_V1 *data = (bz_PlayerJoinPartEventData_V1*)eventData;
    
    // Data
    // ----
    // (int)                  playerID  - The player ID that is joining
    // (bz_BasePlayerRecord*) record    - The player record for the joining player
    // (double)               eventTime - Time of event.
}
break;
```

So what happens when we're in a place of our code where the API doesn't provide a record for us? We create it by ourselves. We'll be using the [`bz_getPlayerByIndex(int playerID)`](https://wiki.bzflag.org/Bz_getPlayerByIndex) function to create a record for the player with the given player ID and we'll receive a pointer to our player record; since we're receiving a pointer to the data, we **must** free the record once we're done with it with [`bz_freePlayerRecord()`](https://wiki.bzflag.org/Bz_freePlayerRecord).

In the previous chapter, it was mentioned that player IDs were unique to players during their current session on a server; these player IDs will be used throughout your plugin. Let's create a player record for the player whose ID is currently 1.

```cpp
int playerID = 1;
bz_BasePlayerRecord *record = bz_getPlayerByIndex(playerID);
```

Now, before we access the information in the player record, we must check that `record` is not NULL because `bz_getPlayerByIndex()` will return NULL if a player with the given ID does not exist.

```cpp
if (!record) {
    // The player did not exist
    return;
}
```

Now that we've created the player record and have checked that it actually contains information, here's *some* of the information we now have access to. Take a look at the [bz_BasePlayerRecord documentation](https://wiki.bzflag.org/Bz_BasePlayerRecord) to view all of the information available in each record.

| name | description |
| ---- | ----------- |
| playerID | ... |
| callsign | the player's callsign |
| team | the current team the player is on |
| currentFlag | the current flag they're holding; an empty string if no flag is being held |
| spawned | a boolean set to true if they're alive |
| verified | set to true if the player is a registered account (i.e. has a `+` next to their name) |
| bzID | the registered player's globally unique ID |
| admin | whether or not the player is an admin |

Since `record` is our pointer to our player record, we can access all of this information with the `->` operator (or the `.` operator too).

```cpp
std::string callsign = record->callsign;

// or

std::string callsign = (*record).callsign;
```

Now that we've stored the callsign, we're done with player record so now we must free it or else it'll continue to take up memory, a small amount but if you continue creating more records without freeing them those small amounts of memory will add up.

```cpp
bz_freePlayerRecord(record);
```

## Modification API Events

In the previous chapter, I mentioned "notification" API events and now I'm mentioning "modification" events? These aren't vocabulary words from the API, they're just what I heard from flying_popcorn years ago and so the names have stuck. What I consider a notification is an event that is used solely for notification purposes and doesn't allow you to change the behavior of the server and a modification event is an event that will allow you to control how the server behaves. Make sense? It's ok if it doesn't, we'll be building a plug-in to show you what it means.

Our plug-in will restrict which flags players can grab based on certain criteria. Let's build a ridiculous plug-in that does the following:

- All players can grab every flag except GM and WG
- Only registered players will be able to grab GM
- Only admins will be able to grab WG

Now, let's see what event can we use to achieve this. `bz_eFlagGrabbedEvent` sounds perfect for the job, right? `bz_eFlagGrabbedEvent` is a notification event meaning we'll only be notified of when a player grabs the flag but we won't be able to prevent a player from actually grabbing the flag, since that'd require us to change the behavior of the server. Most modification events typically begin with `bz_eAllow` so if we look at the list of events again, we'll see that there's a `bz_eAllowFlagGrab` event; now *that* sounds like what we're looking for.

The typical server behavior is as follows: when a player drives over a flag, the server gives the player the flag. We would like to change this behavior so only some players can grab certain flags; this is where our modification event comes in. Notice how there is an `allow` boolean available to use in this event and how our event data is a pointer.

```cpp
case bz_eAllowFlagGrab:
{
    bz_AllowFlagGrabData_V1 *data = (bz_AllowFlagGrabData_V1*)eventData;
    
    // Data
    // ----
    // (int)         playerID  - The ID of the player who is grabbing the flag
    // (int)         flagID    - The ID of the flag that is going to be grabbed
    // (const char*) flagType  - The type of the flag about to be grabbed
    // (bool)        allow     - Whether or not to allow the flag grab
    // (double)      eventTime - The server time at which the event occurred (in seconds).
}
break;
```

Since we're working with a pointer, any modifications to the event data will be seen by the server. In order to prevent the server from giving the player a flag, we need to change the `allow` boolean to false.

```cpp
case bz_eAllowFlagGrab:
{
    bz_AllowFlagGrabData_V1 *data = (bz_AllowFlagGrabData_V1*)eventData;

    data->allow = false;
}
break;
```

That's it! We're done, right? Let's take a closer look at what we're doing. Whenever a player is about to grab a flag, the `bz_eAllowFlagGrab` event is triggered and when that's triggered, we're telling the server not to give the player the flag. Our plug-in was not meant to disable all of the flags for everyone. Let's fix that.

```cpp
case bz_eAllowFlagGrab:
{
    bz_AllowFlagGrabData_V1 *data = (bz_AllowFlagGrabData_V1*)eventData;
    bz_BasePlayerRecord *record = bz_getPlayerByIndex(playerID); // step 1

    // step 2
    if (!record) {
        return;
    }

    std::string flag = flagType; // step 3

    // step 4
    if (flag == "GM" && !record->verified) {
        data->allow = false;
    }
    else if (flag == "WG" && !record->admin) {
        data->allow = false;
    }

    bz_freePlayerRecord(record); // step 5
}
break;
```

### Step 1

As we saw in the previous section, a player record will give us access to the following information that we'll be using in our plug-in:

- Whether or not the player is registered
- Whether or not the player is an admin

### Step 2

As mentioned previously, `bz_getPlayerByIndex()` may return NULL if the given player doesn't exist. In this situation, it is highly unlikely we'll ever get an event triggered by a non-existent player but let's play it safe. If we try to access information from a NULL player record, we'll get a segfault. What happens when a plug-in segfaults? The server crashes. Let's prevent that from happening by making sure we're not working with NULL.

### Step 3

The flag a player is attempting to grab is given to us through the `flagType` variable but it's given to us as a `const char*`. Let's remember that this is C++ and to compare `const char*` values, we need to use [`strcmp`](http://www.cplusplus.com/reference/cstring/strcmp/) instead of `==`. For this reason, I'm assigning the data to an `std::string` just so I can use the convenience of `==`.

### Step 4

Now, this is where we have to do our checks for both the flag types and the player status. We have `record->verified` and `record->admin`, which both return true when the player is using a registered account and when the player is an admin, respectively. If we negate both of these values, we'll get unregistered account status and non-admin status.

### Step 5

Remember, we need to free our player record once we're done with it. Don't leak memory!

## Final Plug-in

That's it! Here's what our final plug-in will look like.

```cpp
#include "bzfsAPI.h"

class FlagRestrictions : public bz_Plugin
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData);
};

BZ_PLUGIN(FlagRestrictions)

const char* FlagRestrictions::Name ()
{
    return "FlagRestrictions";
}

void FlagRestrictions::Init (const char* config)
{
    Register(bz_eAllowFlagGrab);
}

void FlagRestrictions::Cleanup ()
{
    Flush();
}

void FlagRestrictions::Event (bz_EventData* eventData)
{
    switch (eventData->eventType)
    {
        case bz_eAllowFlagGrab:
        {
            bz_AllowFlagGrabData_V1 *data = (bz_AllowFlagGrabData_V1*)eventData;
            bz_BasePlayerRecord *record = bz_getPlayerByIndex(playerID);

            if (!record) {
                return;
            }

            std::string flag = flagType;

            if (flag == "GM" && !record->verified) {
                data->allow = false;
            }
            else if (flag == "WG" && !record->admin) {
                data->allow = false;
            }

            bz_freePlayerRecord(record);
        }
        break;

        default: break;
    }
}
```

## Conclusion

Congratulations on finishing your second plug-in! As always, your feedback is welcome and appreciated! I will be more than happy to improve this series to benefit all future plug-in developers.

### On Your Own

If you would like to expand on what you've learned, here some tasks for you to try and tackle on your own:

1. When a player is not allowed to grab a flag, send a message to that player from the server stating why they are not allowed to grab the flag. For example, if a non-admin attempts to grab Wings, send them a message saying that only admins have the privilege of grabbing the Wings flag. Same for unregistered players and GM.
1. Only allow your own callsign to grab the Laser flag.
1. Add a new flag restriction that will only allow players with an even BZID to grab the Genocide flag. Hint: `record->bzID` is stored as a string.
