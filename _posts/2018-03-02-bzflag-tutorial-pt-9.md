---
title: "BZFlag Plug-ins for Dummies: Chapter 9"
date: 2018-03-02 00:00:00.00 -8
anthology:
  name: BZFlag Plug-ins for Dummies
  type: chapter
  chapter: 9
  summary: Custom Flags & World Weapons
categories:
  - tutorials
tags:
  - bzflag
  - plugins
  - development
---

Happy new year! ...in March. It's a new year and I come bearing gifts as your resident BZFlag Santa Claus from beautiful Los Angeles, California: the place with a Starbucks in every corner and mispelled names on coffee cups in every trashcan. I'm here to bring you a surprise new chapter for _BZFlag Plug-ins for Dummies_ covering world weapons, custom flags, and the latest improvements to the world weapon API.

What are world weapons? They are shots that are fired by the server instead of by tanks. Technically, the world and server are separate so they should be called "server shots" because it's actually the server shooting them but... They were dubbed world weapons so the name stuck. If you've played on Urban Jungle, Clay Hills, or Planet MoFo's Apocalypse, you've seen world weapons. They are those shock waves that happen when you drive over a mine and they are all those extra shots that exist on MoFo with flags like "Death Barrel" or "Triple Barrel."

The world weapon API has always been wonky, counterintuitive to use, not easy to work with, and synonyms. Whenever a tank or the server fires a shot, it is assigned two IDs: a local ID and a global ID. Since this series focuses on plug-in development and not BZFlag's protocol, we only care about a shot's GUID. Up until recent changes, the only way to know a shot's GUID was to assign it yourself, which doesn't sound too hard. It's not. The problem arises when you have multiple plug-ins shooting world weapons and they're each setting their own GUIDs; there are bound to be conflicts. Planet MoFo has run into this issue several times in the past and we've had to be meticulous about picking these shot GUIDs. The new functions that were introduced in the API for BZFlag 2.4.14 solves this issue by reworking how world weapons are handled and making use of GUIDs exclusively. The **only** API function you should be using to fire world weapons is `bz_fireServerShot()`; the other `bz_fireWorldWep()` and `bz_fireWorldGM()` functions are now deprecated and will be removed in the next major release.

I think that's enough of an explanation, so let's build a plug-in instead!

## Plug-in Specification

In this chapter, we'll be building a plug-in that introduces a custom flag. When a player carrying this flag shoots another tank, the victim will die and a shockwave will explode at their location. If that shockwave hits any other enemy tanks, then those kills be credited to the original flag carrier. Let's call this flag, "Cascade."

## Registering Custom Flags

Planet MoFo is known for its custom flags, so let's first explain how we create those custom flags. The BZFS API has a `bz_RegisterCustomFlag()` function, which is used for defining our flag's definition. Once the flag is defined and the plug-in is loaded, map makers and server owners can simply use `+f` to add those flags to a map.

```cpp
bz_RegisterCustomFlag(const char* abbr, const char* name, const char* helpString, bz_eShotType shotType, bz_eFlagQuality quality)
```

Let's create our own Cascade flag and of course, this will go in our plug-in's `Init()` method.

```
void CascadeFlag::Init (const char* config)
{
    bz_RegisterCustomFlag("CA", "Cascade", "All of your victims will trigger a shockwave at their death location", 0, eGoodFlag);
}
```

Now that we've registered our custom flag, let's figure out what this actually means.

- `abbr` is the abbreviation of the flag name; i.e. one or two letter abbreviation of the flag name. Try to be unique and don't cause conflicts with existing flags
- `name` is the full name of the flag
- `helpString` is the message that appears under your mouse box in your HUD, which explains what the flag does
- `shotType` is an enum but it was never implemented in the API, so just use `0`
- `quality` is whether the flag is an `eGoodFlag` or an `eBadFlag`

At this point, our brand new Cascade flag can be added to maps! However, it's as useful as the Useless flag. We will now need to implement the behavior we want. Going back to our specification, we want something to happen if someone shoots a tank with the flag and then shoot a shockwave at their location of death. If you guessed that we're going to listen to the player death event, you're right!

## Implementing Custom Flags' Behavior

It's important that you implement custom flag behavior however **you** want, this example requires that we perform an action on a player's death. The first step is to register the player death event to notify BZFS that we want to listen to this event.

```cpp
void CascadeFlag::Init (const char* config)
{
    Register(bz_ePlayerDieEvent);

    bz_RegisterCustomFlag("CA", "Cascade", "All of your victims will trigger a shockwave at their death location", 0, eGoodFlag);
}
```

Now, we need to implement what's going to happen when a player actually dies. Our goal is shoot a shockwave **only** when the Cascade flag is used, meaning we have to be explicit about it in our implementation.

```cpp
void CascadeFlag::Event (bz_EventData* eventData)
{
    switch (eventData->eventType)
    {
        case bz_ePlayerDieEvent:
        {
            bz_PlayerDieEventData_V1 *data = (bz_PlayerDieEventData_V1*)eventData;

            if (data->flagKilledWith == "CA") // Step 1
            {
                // Step 2
                float vector[3] = {0, 0, 0};
                bz_fireServerShot("SW", data->state.pos, vector, data->killerTeam);
            }
        }
        break;

        default: break;
    }
}
```

### Step 1

Make sure we only fire a world weapon shockwave when a player was actually killed with the Cascade flag. `data->flagKilledWith` will hold the abbreviation of the flag used to kill the player, so we compare it against our own abbreviation: CA.

### Step 2

We have to create a vector for the direction our shot needs to take. However, because we're using a shockwave, there's no need to calculate the vector so we can set it to `0, 0, 0`. However, this vector is calculated with the [lookAt function](http://www.euclideanspace.com/maths/algebra/vectors/lookat/index.htm). There are far more qualified people on Google to cover the maths behind this subject, so I'll let them do that. Thanks to JeffM for helping with all the maths used internally in BZFS for calculating world weapon directions.

```cpp
uint32_t bz_fireServerShot(const char* shotType, float origin[3], float vector[3], bz_eTeamType color = eRogueTeam, int targetPlayerId = -1);
```

## Destroyed by Server

Awesome! We're done, right? Build the plug-in and try it out. Let's look at the specification once again, did we get everything? The cascading affect of the flag doesn't quite work correctly... It shows that the those tanks in the shockwave radius were "destroyed by server." Why?

As I mentioned earlier, these shots are in fact fired by the server, so the death message actually makes sense. Can we make the owner of the _server_ shot a player instead? It's called a server shot for a reason, so no, it's not possible. If only there were a way to reassign the killer in the death event...

## World Weapon Management

Server shots will always be owned by the server and should remain as such. However, manipulating death data is something supported by the API so let's take advantage of that fact.

The `bz_fireServerShot()` function will return the GUID of the shot as a `uint32_t` so we should definitely store it because we'll be using it. Shots in BZFS are just objects stored in a fancy array and these objects support storing arbitrary information for each individual shot. Let's take advantage of this as well!

```cpp
void CascadeFlag::Event (bz_EventData* eventData)
{
    switch (eventData->eventType)
    {
        case bz_ePlayerDieEvent:
        {
            bz_PlayerDieEventData_V1 *data = (bz_PlayerDieEventData_V1*)eventData;

            if (data->flagKilledWith == "CA")
            {
                float vector[3] = {0, 0, 0};
                uint32_t shotGUID = bz_fireServerShot("SW", data->state.pos, vector, data->killerTeam);

                // Step 3
                bz_setShotMetaData(shotGUID, "type", data->flagKilledWith.c_str());
                bz_setShotMetaData(shotGUID, "owner", data->killerID);

                return;
            }

            // Step 4
            uint32_t shotGUID = bz_getShotGUID(data->killerID, data->shotID);

            // Step 5
            if (bz_shotHasMetaData(shotGUID, "type") && bz_shotHasMetaData(shotGUID, "owner"))
            {
                // Step 6
                std::string flagType = bz_getShotMetaDataS(shotGUID, "type"); // 's' for string

                if (flagType == "CA")
                {
                    // Step 7
                    data->killerID = bz_getShotMetaDataI(shotGUID, "owner"); // 'i' for integer
                }
            }
        }
        break;

        default: break;
    }
}
```

### Step 3

Let's make use of the fact that shots can store arbitrary information. Let's store two pieces of information: the "owner" of the shot (the player carrying the Cascade flag) and the "type" of flag. By storing these two pieces of information, we'll be able to know who to credit for the kill and avoid any conflicts with multiple world weapon shots from different flag types.

### Step 4

Remember how I mentioned local IDs and global IDs at the beginning? Well, we have to use the local IDs to get the GUID. Let's just leave it at that because the GUID is all we really care about.

### Step 5

*Every* shot on a server has a GUID and is a shot object in a fancy array; this means that we need to make sure the shot fired is a world weapon that we triggered and control. We confirm that the "type" and "owner" metadata exists for the shot. By doing so, we know that this shot has the structure that this plug-in uses and we're not interfering other shots.

### Step 6

We now confirm that the shot is actually a Cascade shot by getting the "type" metadata. If another plug-in uses the "name" and "type" combination or this plug-in has multiple special flags, we'll know which shots we should actually work with.

### Step 7

We reassign `data->killerID` to the "owner" of the world weapon so that they may take credit for the kill instead of the server.

## Final Plug-in

That's it! The plug-in is now ready for action on your new map!

```cpp
#include "bzfsAPI.h"

class CascadeFlag : public bz_Plugin
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData);
};

BZ_PLUGIN(CascadeFlag)

const char* CascadeFlag::Name ()
{
    return "CascadeFlag";
}

void CascadeFlag::Init (const char* config)
{
    Register(bz_ePlayerDieEvent);

    bz_RegisterCustomFlag("CA", "Cascade", "All of your victims will trigger a shockwave at their death location", 0, eGoodFlag);
}

void CascadeFlag::Cleanup ()
{
    Flush();
}

void CascadeFlag::Event (bz_EventData* eventData)
{
    switch (eventData->eventType)
    {
        case bz_ePlayerDieEvent:
        {
            bz_PlayerDieEventData_V1 *data = (bz_PlayerDieEventData_V1*)eventData;

            if (data->flagKilledWith == "CA")
            {
                float vector[3] = {0, 0, 0};
                uint32_t shotGUID = bz_fireServerShot("SW", data->state.pos, vector, data->killerTeam);

                bz_setShotMetaData(shotGUID, "type", data->flagKilledWith.c_str());
                bz_setShotMetaData(shotGUID, "owner", data->killerID);

                return;
            }

            uint32_t shotGUID = bz_getShotGUID(data->killerID, data->shotID);

            if (bz_shotHasMetaData(shotGUID, "type") && bz_shotHasMetaData(shotGUID, "owner"))
            {
                std::string flagType = bz_getShotMetaDataS(shotGUID, "type");

                if (flagType == "CA")
                {
                    data->killerID = bz_getShotMetaDataI(shotGUID, "owner");
                }
            }
        }
        break;

        default: break;
    }
}
```

## Conclusion

Awesome job! You've just completed your first plug-in that makes use of world weapons, custom flags, AND the new API that was just implemented this last weekend. World weapons aren't always easy to work with and can get pretty complicated so I'd highly recommend that you play around with this on your own.

This new chapter was solely inspired by the [latest API changes that I've been working on with JeffM](https://github.com/BZFlag-Dev/bzflag/pull/99) meaning this series is still on a hiatus. Once I am able to better explain the maths behind these calculations, I'll write another chapter dedicated to just that but until then, thanks for reading!
