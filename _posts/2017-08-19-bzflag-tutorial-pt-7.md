---
title: "BZFlag Plug-ins for Dummies: Chapter 7"
date: 2017-08-19 00:00:00.00 -8
anthology:
  name: BZFlag Plug-ins for Dummies
  type: chapter
  chapter: 7
  summary: Custom Map Objects
categories:
  - tutorials
tags:
  - bzflag
  - plugins
  - development
---

The next topic I'd like to cover regarding plug-in writing is how to create custom map objects. Have you ever played the King of the Hill (KOTH), [All Hands on Deck (AHOD)](https://github.com/allejo/AllHandsOnDeck), or Jumping Skills? In this chapter we'll be building a plug-in that knows when players enter a specified zone to control the hill, capture the flag, or save at a check point. Prior to May 2015, you would have to write all of the logic and math yourself if you wanted to support custom zones. Thanks to the `bz_CustomZoneObject` class, courtesy of yours truly, all of the math and logic has been moved to the API and requires no effort on your part.

These custom map objects are not visible to players. Think of them as the same as a BZW zone object, which has no visible form.

## Registering Your Map Object

The first step is to make your plugin extend the `bz_CustomMapObjectHandler` abstract class, which will require you to implement a virtual function.

```cpp
virtual bool MapObject (bz_ApiString object, bz_CustomMapObjectInfo *data);
```

This virtual function is called during the process of reading the map file and will give you access to _every_ map object. Implementing this virtual function can also help you keep track of bases, teleporters, or any other map object you'd like. We'll be using this function to parse the information of our custom map object.

Similar to creating custom slash commands, you'll be making use of two functions in our `Init()` and `Cleanup()` methods, respectively. This is necessary, otherwise BZFS will not know that your custom map object is a valid object.

- `bz_registerCustomMapObject()`
- `bz_removeCustomMapObject()`

Here's what our setup will look like so far. Now if we load a map file with our custom map object, nothing will happen but an error won't be thrown either.

```cpp
class FlagTakeZonePlugin : public bz_Plugin, public bz_CustomMapObjectHandler
{
public:
    // ...
    virtual bool MapObject (bz_ApiString object, bz_CustomMapObjectInfo *data);
};

BZ_PLUGIN(FlagTakeZonePlugin)

void FlagTakeZonePlugin::Init (const char* /*commandLine*/)
{
    Register(bz_ePlayerUpdateEvent);
    bz_registerCustomMapObject("flagtakezone", this);
}

void FlagTakeZonePlugin::Cleanup (void)
{
    Flush();

    bz_removeCustomMapObject("flagtakezone");
}
```

## Defining Your Map Object

After registering your custom map object, you're going to want to create your own class to handle any of the logic necessary. Thanks to the `bz_CustomZoneObject` class, we won't have to implement any logic for finding the position or rotation of our objects. We just have to implement our own custom logic, if any.

We'll be building a custom zone where certain flags are forbidden and if a player enters the zone carrying that flag, we'll take it from them. We'll also have an optional setting where this zone will only affect rogues. The class for our map object will have a vector of the forbidden flags and will look like so.

```cpp
class FlagZone : public bz_CustomZoneObject
{
public:
    FlagZone() : bz_CustomZoneObject() {}

    bool rogueOnly;
    std::vector<std::string> forbiddenFlags;
};
```

## Parsing Your Map Object (Part 1)

The next step in this plug-in is to actually parse the map object and save the details/configuration to our code. We do this in our implementation of the `MapObject()` method of our plug-in.

It's important that we only read the map objects that we want to be efficient. As I mentioned, this method will run for each map object in a map file, so we should be sure to quickly exit our `MapObject()` implementation if the current map object isn't one that we want or it has no data.

```cpp
bool FlagTakeZonePlugin::MapObject (bz_ApiString object, bz_CustomMapObjectInfo *data)
{
    // Note, this parameter will be in uppercase
    if (object != "FLAGTAKEZONE" || !data)
        return false;
}
```

For the rest of the method, we'll be handling the parsing and saving of the data. But we'll be needing a location to save our zones, so for that reason we'll be creating a vector in our class definition and saving our zones to that.

```cpp
class FlagTakeZonePlugin : public bz_Plugin, public bz_CustomMapObjectHandler
{
public:
    // ...
    virtual bool MapObject (bz_ApiString object, bz_CustomMapObjectInfo *data);

    std::vector<FlagZone> zones;
};
```

Now that we have a location to save our zone data to, let's start parsing and saving the data from the map objects. Given a custom map object that follows this specification:

```
flagtakezone
    position 0 0 0
    size 10 10 10
    take US
    take WG
    rogueonly
end
```

In this specification, the `take` key will take 1 value and that's the flag abbreviation. There will also be an optional `rogueonly` key that takes no parameters. This will be reflected on our `MapObject()` implementation.

Let's take this slowly, so let's go over the first steps in handling our zones.

```cpp
bool FlagTakeZonePlugin::MapObject (bz_ApiString object, bz_CustomMapObjectInfo *data)
{
    if (object != "FLAGTAKEZONE" || !data)
        return false;

    // Step 1
    FlagZone newZone;

    // Step 2
    newZone.handleDefaultOptions(data);

    // Step 3
    zones.push_back(newZone);

    return true;
}
```

### Step 1

At this point, we know we're handling a "flagtakezone" so we'll have to create an instance of a `FlagZone`. This instance will be the zone object we use while reading this map object.

### Step 2

Remember all of the math and logic I mentioned that you didn't have to take care of? Well, this is it. The `handleDefaultOptions()` function will automatically determine if the object is a box or a cylinder, calculate the position, sizing, and rotation. Later on, all we have to do is call the `pointInZone()` method and we'll know whether a given point is inside this zone or not. Awesome, right?

### Step 3

After we've parsed the data for our object, let's add it to our vector so our plug-in can know this zone exists and so it can handle more than one.

## Parsing Your Map Object (Part 2)

Now that we've take care of the "built-in" options for our map object, we'll need to take care of our custom options. In this step, we need to loop through the rest of the data in the map object, parse it, and save it. What data am I talking about? The custom `take` and `rogueonly` options that our map object supports. All of this information is stored in our `data` argument, which we must loop through.

The map object data stored is an array of the data in the object delimited by new lines. Basically, we have an array that looks like this:

```
["position 0 0 0", "size 10 10 10", "take US", "take WG", "rogueonly"]
```

We'll be using a for loop to go through each of these lines and save them to an `std::string` for convenience. By calling `handleDefaultOptions()`, we don't have to worry about `position` or `size` or any of those other "built-in" options. We just need to handle our own additional options.

```cpp
bool FlagTakeZonePlugin::MapObject (bz_ApiString object, bz_CustomMapObjectInfo *data)
{
    if (object != "FLAGTAKEZONE" || !data)
        return false;

    FlagZone newZone;
    newZone.handleDefaultOptions(data);

    // Loop through all of the data
    for (unsigned int i = 0; i < data->data.size(); i++)
    {
        std::string line = data->data.get(i).c_str();
    }

    zones.push_back(newZone);
    return true;
}
```

Now that we'll looping through our data, let's actually parse it and make sense of it. We'll make use of `bz_APIStringList`'s awesome tokenizing functionality so we don't have to worry about building our own tokenizer or using Boost.

```cpp
for (unsigned int i = 0; i < data->data.size(); i++)
{
    std::string line = data->data.get(i).c_str();

    // Step 4
    bz_APIStringList nubs;
    nubs.tokenize(line.c_str(), " ", 0, true);

    if (nubs.size() > 0)
    {
        // Step 5
        std::string key = bz_toupper(nubs.get(0).c_str());

        // Step 5.1
        if (key == "TAKE" && nubs.size() > 1)
        {
            newZone.forbiddenFlags.push_back(nubs.get(1).c_str());
        }
    }
    else
    {
        // Step 6
        std::string key = bz_toupper(line.c_str());

        // Step 6.1
        if (line == "ROGUEONLY")
        {
            newZone.rogueOnly = true;
        }
    }
}
```

### Step 4

Following the BZW language definition, we'll be tokenizing on a single space between values.

You *could* do your own custom definition here if you'd like, but I highly recommend following the BZW convention and making it easy for map makers to stay consistent.

### Step 5

If our tokenizer resulted in more than one value, that means we have a line with parameters. Because BZW is case-insensitive, I'll convert the first token to uppercase so we can compare it with our known options.

You may also convert it to lowercase instead, but I prefer using uppercase since that's how the `object` value is defined.

### Step 5.1

Since we only have the `take` option that accepts parameters, our if statement is pretty simple. However, the more options you support, the longer your if statement may be.

Lastly, we'll take the second token, which we expect to be our flag abbreviation, and we'll push it into the vector of our `FlagZone` instance.

### Step 6

Since we don't have any tokens, that means it's a line without any parameters. Convert it into uppercase for the same reason as before.

### Step 6.1

Because we only have a single option that takes no parameters, we just need to check for the `rogueonly` option and set it accordingly in our `FlagZone` instance.

## Making Use of Your Map Object

Now that we've defined our object, parsed it, and saved all of the data... Let's actually do something with it! We'll be hooking into `bz_ePlayerUpdateEvent` so we can listen to player updates, which happens *a lot*.

As mentioned earlier, all of our zones have a convenient `pointInZone()` method, which we will be using to check each player update to see if they're in a zone.

```cpp
// Step 7
std::string currentFlag = bz_getPlayerFlag(updateData->playerID);

if (currentFlag.empty())
{
    return;
}

for (auto &zone : zones)
{
    // Step 8
    if (zone.rogueOnly && bz_getPlayerTeam(updateData->playerID) != eRogueTeam)
    {
        continue;
    }

    // Step 9
    if (zone.pointInZone(updateData->state.pos))
    {
        // Step 10
        for (auto flag : zone.forbiddenFlags)
        {
            if (currentFlag == flag)
            {
                bz_sendTextMessagef(BZ_SERVER, update->playerID, "This %s flag is forbidden here", currentFlag.c_str());
                bz_removePlayerFlag(update->playerID);
            }
        }
    }
}
```

### Step 7

Get the current flag of the player and store it in an `std::string` for convenience. If the player doesn't have a flag, we don't have to bother checking through any of the zones.

### Step 8

We need to be able to short circuit if the current zone we're checking is "rogue only" and the player isn't a rogue. Checking a boolean and a team is faster than calculating whether or not a player is in a zone.

### Step 9

By using our handy `pointInZone()` method, we can check if the player is inside our zone.

### Step 10

At this point, we've determined that our player is inside our zone, is carrying a flag, and we need to check whether the flag is forbidden or not. We loop through the forbidden flags defined for this zone and we remove the flag if it's a match.

## Our Complete Plug-in

```cpp
#include "bzfsAPI.h"

class FlagZone : public bz_CustomZoneObject
{
public:
    FlagZone() : bz_CustomZoneObject() {}

    bool rogueOnly;
    std::vector<std::string> forbiddenFlags;
};

class FlagTakeZonePlugin : public bz_Plugin, public bz_CustomMapObjectHandler
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData);

    virtual bool MapObject (bz_ApiString object, bz_CustomMapObjectInfo *data);
};

BZ_PLUGIN(FlagTakeZonePlugin)

const char* FlagTakeZonePlugin::Name ()
{
    return "Flag Take Zone Plugin";
}

void FlagTakeZonePlugin::Init (const char* /*commandLine*/)
{
    Register(bz_ePlayerUpdateEvent);

    bz_registerCustomMapObject("flagtakezone", this);
}

void FlagTakeZonePlugin::Cleanup (void)
{
    Flush();

    bz_removeCustomMapObject("flagtakezone");
}

bool FlagTakeZonePlugin::MapObject (bz_ApiString object, bz_CustomMapObjectInfo *data)
{
    if (object != "FLAGTAKEZONE" || !data)
        return false;

    FlagZone newZone;
    newZone.handleDefaultOptions(data);

    for (unsigned int i = 0; i < data->data.size(); i++)
    {
        std::string line = data->data.get(i).c_str();

        bz_APIStringList nubs;
        nubs.tokenize(line.c_str(), " ", 0, true);

        if (nubs.size() > 0)
        {
            std::string key = bz_toupper(nubs.get(0).c_str());

            if (key == "TAKE" && nubs.size() > 1)
            {
                newZone.forbiddenFlags.push_back(nubs.get(1).c_str());
            }
        }
        else
        {
            std::string key = bz_toupper(line.c_str());

            if (line == "ROGUEONLY")
            {
                newZone.rogueOnly = true;
            }
        }
    }

    zones.push_back(newZone);
    return true;
}

void FlagTakeZonePlugin::Event (bz_EventData* eventData)
{
    switch (eventData->eventType)
    {
        case bz_ePlayerUpdateEvent:
        {
            bz_PlayerUpdateEventData_V1 *updateData = (bz_PlayerUpdateEventData_V1*)eventData;
            
            std::string currentFlag = bz_getPlayerFlag(updateData->playerID);

            if (currentFlag.empty())
            {
                return;
            }

            for (auto &zone : zones)
            {
                if (zone.rogueOnly && bz_getPlayerTeam(updateData->playerID) != eRogueTeam)
                {
                    continue;
                }

                if (zone.pointInZone(updateData->state.pos))
                {
                    for (auto flag : zone.forbiddenFlags)
                    {
                        if (currentFlag == flag)
                        {
                            bz_sendTextMessagef(BZ_SERVER, update->playerID, "This %s flag is forbidden here", currentFlag.c_str());
                            bz_removePlayerFlag(update->playerID);
                        }
                    }
                }
            }
        }
        break;

        default: break;
    }
}
```

## Conclusion

Congrats on building your first plug-in that adds a custom map object! Supporting custom map objects may seem pretty inefficient and resource intensive but so long as you write your code responsibly, no extra lag will be introduced due to these zones.

## Epilogue

My apologies for this chapter being one week late! I had originally written it with less detail and decided to give myself another week to add more detail and rewrite parts of it. As an update, the release schedule for this series has changed to being every other Saturday. With school starting soon and topics requiring more detail, I won't be able to write them as quickly as I had originally intended. Thanks for understanding.
