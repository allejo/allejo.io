---
title: "BZFlag Plug-ins for Dummies: Chapter 4"
date: 2017-07-01 00:00:00.00 -8
anthology:
  name: BZFlag Plug-ins for Dummies
  type: chapter
  chapter: 4
  summary: Stateful Data in Plug-ins
categories:
  - tutorials
tags:
  - bzflag
  - plugins
  - development
---

For those of you who think I write these chapters ahead of time, you're wrong.

In the last chapter, we went over how slash commands worked at a very basic level and today we'll be going in-depth with slash commands and [stateful data](https://en.wikipedia.org/wiki/State_(computer_science)).

## Plug-in Specification

In this chapter, we'll be building a plug-in that allows players to respawn at the same location as a player of their choice.

- When a player uses the `/sneak` command, they will be specifying which player's location they would like to spawn at.
- If a player has used the `/sneak` command, their next spawn location will be dictated by the plug-in.

## Stateful Data in Plug-ins

I won't go into detail what [stateful data](https://en.wikipedia.org/wiki/State_(computer_science)) is because there's a Wikipedia page for it but I will give an example. Let's consider the following situations:

1. On a server, a player has been `/mute`'d by an admin. How does the server remember that the player cannot talk each time the player tries to send a message? This is stateful data, the server needs to remember the current *state* of the player and their inability to talk.
1. During a CTF game, we need to check if the teams are fair. We'll keep a boolean of whether or not CTF is currently enabled. This boolean will be used when checking whether or not to allow a player to grab a team flag. This is the current *state* of the CTF match.

This is a common requirement when building plug-ins especially to communicate data between different events, slash commands, functions, etc. This information could be thought of as "global variables," however it's still within the scope of the plug-in (they're actually instance variables). Any stateful data stored this way will remain in the server's memory. If a server were to restart or the plug-in is unloaded, then all this data would be lost.

What stateful data do we need to keep track of? We need to keep track of whom a player has specified as their target. A good number to remember is: 256; this is approximately the maximum number of player slots a BZFlag server can handle (some numbers are reserved, so it's actually less).

When we would like to keep stateful data, we'll be declaring the necessary variables in the class definition of the plug-in and initializing those variables to default values in our `Init()` function. We'll be storing most of our stateful data in simple arrays since they're faster than vectors or maps.

> **Heads up!** Depending on how complicated the information you're handling is, a vector or a map may be better suited.

Let's create an array that will be able to handle information for all of our players on the server.

```cpp
int sneakAttack[256];
```

And just like that, we've got 256 records; one for each player slot even the reserved player slots. Here's how the structure will behave:

```
sneakAttack[ <player ID of whom this record belongs to> ] = <the ID of the victim of this sneak attack>;
```

If that doesn't make sense, let's consider the following situation: Player 0 would like to perform a sneak attack on Player 5. In the above int array, we'll have the following values:

```
sneakAttack[0] = 5;
```

We'll be initializing the values for the entire array to `-1`, which will mean that there is no sneak attack planned yet. Why `-1`? Because player slots start from 0, so a negative value will be apt. This way, we won't bombard player slot 0 with a lot of sneak attacks.

Here's what our class will look like and our initialization of the array.

```cpp
class Sneak : public bz_Plugin
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData);

    int sneakAttack[256];
};

// ...

void Sneak::Init (const char* config)
{
    // ...

    // Range-based for loop syntax; a C++11 feature
    for (int &i : sneakAttack)
    {
        i = -1;
    }
}
```

## Slash Command Parameters + Stateful Data

Following the plug-in specification, we'll be implementing the `/sneak` command and make use of the stateful data. Here's the syntax of the slash command:

- `/sneak <player ID | callsign>`

Let's get the skeleton of the slash command implementation from our handy [plug-in skeleton generator](https://bz-plugin-starter.projects.allejo.io/).

```cpp
bool Sneak::SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "sneak")
    {
        
        return true;
    }
    
    return false;
}
```

Remembering from last chapter, `playerID` is the ID of the player who executed the command and `params` is a list of parameters given to the command (separated by space and respecting quotes).

Let's start our implementation by saving the parameter data into an easy to remember variable.

```cpp
bool Sneak::SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "sneak")
    {
        const char* victimID = params->get(0).c_str();

        return true;
    }
    
    return false;
}
```

Now that we have information stored, let's get started with our implementation! So `victimID` stores the victim of the sneak attack, but we don't know how the player typed it in. It could be any of the following:

- `#0`
- `0`
- `my callsign`

The BZFS API works exclusively with player IDs, which are integers. So what are we going to do with the above strings? Luckily for us, [`bz_getPlayerBySlotOrCallsign()`](https://wiki.bzflag.org/Bz_getPlayerBySlotOrCallsign) exists exactly for this purpose. It will take whatever value the player gave us and give us one of two things we know how to work with:

- `bz_BasePlayerRecord*`
- `NULL`

Let's use it to get a player record of the victim or exit out if the victim doesn't exist on the server.

```cpp
bool Sneak::SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "sneak")
    {
        const char* victimID = params->get(0).c_str();

        bz_BasePlayerRecord *pr = bz_getPlayerBySlotOrCallsign(victimID);

        if (!pr)
        {
            bz_sendTextMessagef(BZ_SERVER, playerID, "player \"%s\" not found", victimID);
        }
        else
        {
            bz_freePlayerRecord(pr);
        }

        return true;
    }
    
    return false;
}
```

Now that we have a player record, let's set our stateful data for this player's sneak attack. This is important because this information will be accessed the next time a player spawns, which is an event, which is implemented in our `Event()` function. Using stateful data allows us to share information across different parts of our code.

```cpp
bool Sneak::SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "sneak")
    {
        const char* victimID = params->get(0).c_str();

        bz_BasePlayerRecord *pr = bz_getPlayerBySlotOrCallsign(victimID);

        if (!pr)
        {
            bz_sendTextMessagef(BZ_SERVER, playerID, "player \"%s\" not found", victimID);
        }
        else
        {
            sneakAttack[playerID] = pr->playerID;
            bz_freePlayerRecord(pr);
        }

        return true;
    }
    
    return false;
}
```

We're all done with our slash command! Let's give our slash command a try with different information.

- Works as intended. Yay!
  ```
  /sneak allejo
  ```
- Got a message: `player "callsign" not found`
  ```
  /sneak callsign with spaces
  ```  
- Got a message: `player "" not found`
  ```
  /sneak
  ```

Ok, we definitely want some type of warning if I give the command too much or too little information. Let's fix that, the command expects one parameter so let's ensure we always have 1 parameter before we do any of our business logic.

```cpp
bool Sneak::SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "sneak")
    {
        if (params->size() != 1) 
        {
            bz_sendTextMessage(BZ_SERVER, playerID, "/sneak <player ID|callsign>");
            return true;
        }

        const char* victimID = params->get(0).c_str();

        bz_BasePlayerRecord *pr = bz_getPlayerBySlotOrCallsign(victimID);

        if (!pr)
        {
            bz_sendTextMessagef(BZ_SERVER, playerID, "player \"%s\" not found", victimID);
        }
        else
        {
            sneakAttack[playerID] = pr->playerID;
            bz_freePlayerRecord(pr);
        }

        return true;
    }
    
    return false;
}
```

Ok, now we're done with our slash command. Moving on...

## Modification Events + Stateful Data

Our slash command will save information about our sneak attack, but now we have to make use of it during our spawn event. In [chapter 2, we went over modification events]({{ url(collections.posts['2017-06-17-bzflag-tutorial-pt-2']) }}#modification-api-events) and their ability to change how the server behaves. For this plug-in, we'll be modifying the spawn location of a player and will need an event relating to spawning. Here are our options:

- bz_eAllowSpawn
- bz_eGetPlayerSpawnPosEvent
- bz_ePlayerSpawnEvent

Remember, events beginning with with `bz_eAllow` are modification events but there are some exceptions to the rule. If we take a look at the documention for of these events, we'll want to pick `bz_eGetPlayerSpawnPosEvent` since this is the only event that gives us coordinates for a player's spawn location. Additionally, there's a `handled` boolean, which let's us tell the server that we have modified the spawn location.

```cpp
case bz_eGetPlayerSpawnPosEvent:
{
    bz_GetPlayerSpawnPosEventData_V1 *data = (bz_GetPlayerSpawnPosEventData_V1*)eventData;
    
    // Data
    // ----
    // (int)          playerID  - ID of the player that is requesting the spawn position.
    // (bz_eTeamType) team      - The team the player is currently in.
    // (bool)         handled   - The current state representing if other plug-ins have modified the spawn position.
    // (float[3])     pos       - Position where the player will be spawned. This value is initialized to the server
    // (float)        rot       - The rotational direction that the player will be spawned at. This value is initialized
    // (double)       eventTime - The local server time of the event.
}
break;
```

Now, let's write our implementation of this event using our stateful data.

```cpp
case bz_eGetPlayerSpawnPosEvent:
{
    bz_GetPlayerSpawnPosEventData_V1 *data = (bz_GetPlayerSpawnPosEventData_V1*)eventData;

    // Step 1
    if (sneakAttack[data->playerID] >= 0)
    {
        // Step 2
        bz_BasePlayerRecord *pr = bz_getPlayerByIndex(sneakAttack[data->playerID]);

        // Step 2.1
        if (!pr) 
        {
            bz_sendTextMessage(BZ_SERVER, data->playerID, "Your sneak attack failed! Victim not found.");
            return;
        }

        // Step 3
        data->handled = true;
        data->pos[0] = pr->lastKnownState->pos[0];
        data->pos[1] = pr->lastKnownState->pos[1];
        data->pos[2] = pr->lastKnownState->pos[2];
        data->rot = pr->lastKnownState->rotation;

        // Step 4
        bz_freePlayerRecord(pr);

        // Step 5
        sneakAttack[data->playerID] = -1;
    }
}
break;
```

### Step 1

Remember, a `-1` value means that there isn't a sneak attack prepared so we can move on if there isn't a sneak attack planned.

### Step 2

Create a player record for the victim of the sneak attack. The player record contains a `bz_PlayerUpdateState` object which contains the player's last known position.

### Step 2.1

Remember, a player record could be NULL so we need to make sure that our victim actually exists.

### Step 3

We set the `handled` boolean to true to notify the server that a plug-in will be changing the spawn location of a player. A player's position is denoted by a `float[3]` where `0 -> x`, `1 -> y`, and `2 -> z` on a 3D coordiante system.

### Step 4

Remember to free any memory you allocate!

### Step 5

Set the sneak attack value to `-1` so next time the player spawns, they won't be at the same victim's location **unless** they use the `/sneak` command again.

## Keeping Our State Clean

An important aspect about using state data is that we need to keep it clean. It's been mentioned before that player IDs are reused when players join/part, so what would happen if Player 0 plans a sneak attack on Player 5 but leaves before they respawn? The next player who joins as Player 0 will have a sneak attack on Player 5 already without even using the `/sneak` command. To prevent this from happening, it's a good idea to reset state data whenever necessary.

In this case, since our state data is directly tied to each player, we'll need to reset the data each time the player leaves. We could also reset our data when a player joins and in this case example, it wouldn't matter. However, if you start keeping more memory intensive information, why bother keeping that around when a player is already gone? So it's a good idea to reset data when a player parts.

```cpp
case bz_ePlayerPartEvent:
{
    bz_PlayerJoinPartEventData_V1 *data = (bz_PlayerJoinPartEventData_V1*)eventData;

    sneakAttack[data->playerID] = -1;
}
break;
```

## Our Sneak Plug-in

Here's our whole plug-in from this chapter!

```cpp
#include "bzfsAPI.h"

class Sneak : public bz_Plugin, public bz_CustomSlashCommandHandler
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData);
    virtual bool SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params);

    int sneakAttack[256];
};

BZ_PLUGIN(Sneak)

const char* Sneak::Name ()
{
    return "Sneak";
}

void Sneak::Init (const char* config)
{
    Register(bz_eGetPlayerSpawnPosEvent);
    Register(bz_ePlayerPartEvent);
    
    bz_registerCustomSlashCommand("sneak", this);

    // Range-based for loop syntax; a C++11 feature
    for (int &i : sneakAttack)
    {
        i = -1;
    }
}

void Sneak::Cleanup ()
{
    Flush();
    
    bz_removeCustomSlashCommand("sneak");
}

void Sneak::Event (bz_EventData* eventData)
{
    switch (eventData->eventType)
    {
        case bz_eGetPlayerSpawnPosEvent:
        {
            bz_GetPlayerSpawnPosEventData_V1 *data = (bz_GetPlayerSpawnPosEventData_V1*)eventData;

            if (sneakAttack[data->playerID] >= 0)
            {
                bz_BasePlayerRecord *pr = bz_getPlayerByIndex(sneakAttack[data->playerID]);

                if (!pr) 
                {
                    bz_sendTextMessage(BZ_SERVER, data->playerID, "Your sneak attack failed! Victim not found.");
                    return;
                }

                data->handled = true;
                data->pos[0] = pr->lastKnownState->pos[0];
                data->pos[1] = pr->lastKnownState->pos[1];
                data->pos[2] = pr->lastKnownState->pos[2];
                data->rot = pr->lastKnownState->rotation;

                bz_freePlayerRecord(pr);

                sneakAttack[data->playerID] = -1;
            }
        }
        break;

        case bz_ePlayerPartEvent:
        {
            bz_PlayerJoinPartEventData_V1 *data = (bz_PlayerJoinPartEventData_V1*)eventData;

            sneakAttack[data->playerID] = -1;
        }
        break;

        default: break;
    }
}

bool Sneak::SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "sneak")
    {
        if (params->size() != 1) 
        {
            bz_sendTextMessage(BZ_SERVER, playerID, "/sneak <player ID|callsign>");
            return true;
        }

        const char* victimID = params->get(0).c_str();

        bz_BasePlayerRecord *pr = bz_getPlayerBySlotOrCallsign(victimID);

        if (!pr)
        {
            bz_sendTextMessagef(BZ_SERVER, playerID, "player \"%s\" not found", victimID);
        }
        else
        {
            sneakAttack[playerID] = pr->playerID;
            bz_freePlayerRecord(pr);
        }

        return true;
    }

    return false;
}
```

## Conclusion

After last week's short chapter, was this chapter long enough for you? I hope I didn't overwhelm you with too much information and that all of this made sense to you. Next up, we'll be going over configuration files.

Special thanks to the_map for being this week's guest editor!

### On Your Own

If you would like to continue practicing, expand on this plug-in on your own by accomplishing the following task:

- Keep track of a new bit of stateful data for each sneak attack. The new information will be a flag the player will receive when they spawn.
  - Modify the slash command to be: `/sneak <player ID | callsign> <flag abbv>`
  - Hints: `bz_ePlayerSpawnEvent` & `bz_givePlayerFlag()`
