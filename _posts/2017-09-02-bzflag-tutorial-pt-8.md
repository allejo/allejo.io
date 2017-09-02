---
title: "BZFlag Plug-ins for Dummies: Chapter 8"
date: 2017-09-02 00:00:00.00 -8
anthology: BZFlag Plug-ins for Dummies
categories:
  - tutorials
tags:
  - bzflag
  - plugins
  - development
---

A common task to achieve in plug-ins is to have a countdown or time delayed functionality. As an example, a plug-in introducing a custom game mode such as Last Tank Standing will need a countdown for the last 5 seconds of each round and will need to kick a new player at a set interval. This is C++ so there's no magic `setTimeout()` function that we can use and there's no API function; instead we'll have to make use of the `bz_eTickEvent` and `time_t` objects.

## The Tick Event

The `bz_eTickEvent` is an event that occurs every tick in the main BZFS loop. So, what's a "tick?" A single tick does not mean a single second; typically there are more ticks per second and it's never a consistent amount. Because ticks aren't designed to be used as an accurate measurement of time, we use a `time_t` object, which was designed to handle time.

## Plug-in Specification

We'll be a building a plug-in that handles a timed game with a 5 second countdown after the `/start` slash command is executed.

## The Setup

We'll be needing to create 3 separate variables to handle the 5 second countdown.

- `isCountdownInProgress` - Whether or not a countdown is progress (optional, but very handy)
- `countdownTotal` - The amount of seconds we will announce in our countdown
- `lastCountdownCheck` - This `time_t` object will be used to keep the timestamp of the last time we announced a second in our countdown.

```cpp
class TimerPlugin : public bz_Plugin
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData);

    bool isCountdownInProgress;
    int countdownTotal;
    time_t lastCountdownCheck;
};

void TimerPlugin::Init (const char* config)
{
    isCountdownInProgress = false;
}
```

First, we'll be implementing our `/start` slash command, which will start our countdown. What we need to do is the following:

1. Set our boolean to true so we have easy access to check whether or not a countdown is progress
2. Set the amount of seconds our countdown will go on for
3. Set the timestamp of our last check to the current time

```cpp
bool TimerPlugin::SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "start")
    {
        isCountdownInProgress = true; // 1
        countdownTotal = 5;           // 2
        time(&lastCountdownCheck);    // 3
        return true;
    }

    return false;
}
```

Now, let's take a look at implementing the actual countdown which will happen in the tick event. So what's actually happening? Imagine a cliché family road trip where the children are asking, "are we there yet?" repeatedly. Our plug-in will behave exactly the same way, except it'll be asking: "has it been *at least* one second since my last announcement?"

It's very important to notice the "at least one second" in the question. As mentioned, ticks happen at uneven intervals so it's quite possible that the last tick happened 1.6 seconds ago. If we check if it was exactly 1 second ago (with `==`), chances are we'll miss a tick and we'll never continue in the countdown because the `difftime()` value will never be exactly 1 again. By checking if it's been at least one second, we don't care if the last tick was 1.6 seconds ago, we'll still be able to continue.

```cpp
case bz_eTickEvent:
{
    // We only want to care about checking timestamps if the countdown is in progress
    // ...remember we want to be efficient and quick in our plug-ins.
    if (isCountdownInProgress)
    {
        time_t currentTime;
        time(&currentTime);

        // difftime() returns the difference in time objects in seconds
        if (difftime(currentTime, lastCountdownCheck) >= 1)
        {
            bz_sendTextMessage(BZ_SERVER, BZ_ALLUSERS, "%d...", countdownProgress);

            time(&lastCountdownCheck); // Update the time of the last number announced
            countdownProgress--; // Decrease the amount of seconds we still have to go in our countdown
        }
    }
}
break;
```

Looks good, right? Yea. But we're not done. If you examine this example closer, you'll notice that we don't actually stop the countdown after it's been started; meaning we'll start announcing negative numbers and countdown indefinitely. Let's fix that.

Once our countdown progress reaches zero after all the `countdownProgress--` decrements, we set our `isCountdownInProgress` boolean to false and we'll no longer enter this bit of code in the next tick event until another `/start` is executed.

```cpp
case bz_eTickEvent:
{
    if (isCountdownInProgress)
    {
        time_t currentTime;
        time(&currentTime);

        if (difftime(currentTime, lastCountdownCheck) >= 1)
        {
            if (countdownProgress <= 0)
            {
                isCountdownInProgress = false;
                bz_sendTextMessage(BZ_SERVER, BZ_ALLUSERS, "The countdown is over. Good luck and have fun!");
            }
            else
            {
                bz_sendTextMessagef(BZ_SERVER, BZ_ALLUSERS, "%d...", countdownProgress);

                time(&lastCountdownCheck);
                countdownProgress--;
            }
        }
    }
}
break;
```

## Our Complete Plug-in

```cpp
#include "bzfsAPI.h"

class TimerPlugin : public bz_Plugin, public bz_CustomSlashCommandHandler
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData);
    virtual bool SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params);

    bool isCountdownInProgress;
    int countdownTotal;
    time_t lastCountdownCheck;
};

BZ_PLUGIN(TimerPlugin)

const char* TimerPlugin::Name ()
{
    return "Timer Plugin";
}

void TimerPlugin::Init (const char* config)
{
    Register(bz_eTickEvent);

    bz_registerCustomSlashCommand("start", this);
}

void TimerPlugin::Cleanup ()
{
    Flush();

    bz_removeCustomSlashCommand("start");
}

void TimerPlugin::Event (bz_EventData* eventData)
{
    switch (eventData->eventType)
    {
        case bz_eTickEvent:
        {
            if (isCountdownInProgress)
            {
                time_t currentTime;
                time(&currentTime);

                if (difftime(currentTime, lastCountdownCheck) >= 1)
                {
                    if (countdownProgress <= 0)
                    {
                        isCountdownInProgress = false;
                        bz_sendTextMessage(BZ_SERVER, BZ_ALLUSERS, "The countdown is over. Good luck and have fun!");
                    }
                    else
                    {
                        bz_sendTextMessagef(BZ_SERVER, BZ_ALLUSERS, "%d...", countdownProgress);

                        time(&lastCountdownCheck);
                        countdownProgress--;
                    }
                }
            }
        }
        break;

        default: break;
    }
}

bool TimerPlugin::SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "start")
    {
        isCountdownInProgress = true;
        countdownTotal = 5;
        time(&lastCountdownCheck);

        return true;
    }

    return false;
}
```

## Conclusion

The BZFS API doesn't have a `setTimeout()` function nor does it have any custom countdown functionality, so we're left to implement things ourselves. My [Last Tank Standing](https://github.com/allejo/lastTankStanding) plug-in makes use of this technique for the countdown at the beginning of each match and also to keep track of the duration of each round to kick a new player.
