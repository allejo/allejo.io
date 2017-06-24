---
title: "BZFlag Plug-ins for Dummies: Chapter 3"
date: 2017-06-24 00:00:00.00 -8
anthology: BZFlag Plug-ins for Dummies
categories:
  - tutorials
tags:
  - bzflag
  - plugins
  - development
---

We've both made it to chapter 3; we should be proud. You, because you've made it this far. Me, because I've been able to write this on a weekly basis without missing a day thus far. Today, we'll be talking about slash commands. Don't worry, like always, we'll be going step by step.

## Slash Commands

Registering custom slash commands is pretty easy once you've got the hang of things and understand what is going on. Once again, I'll be using my [plug-in generator](https://bz-plugin-starter.projects.allejo.io/) to take care of all the generation and set up.

### Extending a Class

As mentioned in the first chapter, our plug-ins will always extend the `bz_Plugin` class but in order to implement slash commands, we must extend one more class: `bz_CustomSlashCommandHandler`.

> **Heads up!** This is an opinionated approach where all the logic is in one class. You may wish to create a separate class dedicated to handling slash command logic but I prefer keeping things together so this chapter will keep things in one class.

By extending `bz_CustomSlashCommandHandler`, we're required to implement the following virtual function:

```cpp
virtual bool SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params);
```

Here's an explanation of each parameter:

- `playerID` - The ID of the player who executed the slash command
- `command` - The command that was executed (this is useful when you register more than one command)
- `message` - The slash command and all of the parameters together as a string. This *parameter* is commented out in order to prevent compiler warnings of unused variables since `message` is rarely used. Notice carefully that only the variable name is commented out and not the data type.
- `params` - A list of the parameters given to the command; parameters are split by spaces and respects quotes

### Registering the Slash Command

When coming up with your custom slash commands, there are few things that you should keep in mind:

- Don't accidentally override existing slash commands
- Slash commands names cannot have spaces
- Keep your slash commands easy to remember

We must tell BZFS that we'll be creating a custom command so the server knows that when this custom command is executed, it is forwarded to our plug-in instead of having the server attempt to handle an unknown command. To register a custom slash command called "mycommand", we call the [`bz_registerCustomSlashCommand()`](https://wiki.bzflag.org/Bz_registerCustomSlashCommand) function inside of our plug-in's `Init()` function. Remember, the `Init()` function is the first function called when a plug-in is loaded, so you must tell BZFS your custom commands when your plug-in is first loaded.

```cpp
bz_registerCustomSlashCommand("mycommand", this);
```

The second argument to this function is a reference to the class handling the implementation of the slash command, so `this` refers to the current class we're in. If you'd like to separate the commands into a separate class, you would use a reference to that class instead.

> **Heads up!** [Since 2.4.4, custom slash commands can override existing commands](https://forums.bzflag.org/viewtopic.php?f=78&t=19007) meaning that we can override built-in server commands such as `/kick` or `/ban`; more on this later on.

### Removing the Slash Command

And when the plug-in is unloaded, we must tell BZFS that we'll be removing the slash command. Otherwise, the server will attempt to forward the command to a plug-in that is no longer loaded and that's just not nice. We need to call [`bz_removeCustomSlashCommand()`](https://wiki.bzflag.org/Bz_removeCustomSlashCommand) the `Cleanup()` function, which is called when the plug-in is unloaded.

```cpp
bz_removeCustomSlashCommand("mycommand");
```

### Implementing Commands

The finally step to creating custom slash commands is implementing their behavior and what they do. We do this in the implementation of the virtual `SlashCommand()` function that we saw at the beginning of this chapter.

```cpp
bool SAMPLE_PLUGIN::SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "mycommand") // step 1
    {
        bz_sendTextMessagef(BZ_SERVER, playerID, "You ran the %s command.", command.c_str()); // step 2
        return true; // step 3
    }
    
    return false; // step 4
}
```

#### Step 1

The first step is to check which command got called. If your plug-in has multiple custom commands, you need to check that you're defining the behavior for the correct command and in this example, we're doing that with an if statement. Notice that `command` is a `bz_ApiString` so that means we can use the `==` operator for comparisons.

#### Step 2

We send a message to the player who executed the command and tell them what command they ran.

#### Step 3

Notice how `SlashCommand()`'s return type is a boolean? If a slash command's implementation returns true, then the BZFS will know that the command has been handled and doesn't need to do anything else. If this implementation returns false, then BZFS will attempt to take care of the implentation; this is especially useful for partially overriding built-in slash commands.

#### Step 4

This return statement will typically never be reached unless you have not implemented your command so it's a good idea to return false so BZFS will throw an error of an unknown command.

### Our Sample Plug-in

Here's what our final plug-in looks like.

```cpp
#include "bzfsAPI.h"

class SAMPLE_PLUGIN : public bz_Plugin, public bz_CustomSlashCommandHandler
{
    virtual const char* Name ();
    virtual void Init (const char* config);
    virtual void Cleanup ();
    virtual void Event (bz_EventData* eventData) { return; };
    virtual bool SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params);
};

BZ_PLUGIN(SAMPLE_PLUGIN)

const char* SAMPLE_PLUGIN::Name ()
{
    return "SAMPLE_PLUGIN";
}

void SAMPLE_PLUGIN::Init (const char* config)
{
    bz_registerCustomSlashCommand("mycommand", this);
}

void SAMPLE_PLUGIN::Cleanup ()
{
    Flush();
    
    bz_removeCustomSlashCommand("mycommand");
}

bool SAMPLE_PLUGIN::SlashCommand (int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "mycommand")
    {
        bz_sendTextMessagef(BZ_SERVER, playerID, "You ran the %s command.", command.c_str());
        return true;
    }
    
    return false;
}
```

## Conclusion

Was this chapter too short for you? Sorry about that, it's not laziness I swear! I did not want this chapter to be overwhelming with a lot of information. Stay tuned for next week's chapter where we'll be learning about slash command parameters and [stateful data](https://en.wikipedia.org/wiki/State_(computer_science)).

### On Your Own

Exploring the [list of API functions](https://wiki.bzflag.org/Functions_(API)), create commands to match the following scenarios:

- A slash command that will double your current score. Hint: `bz_incrementPlayerWins()`
- A slash command that will return the current flag that you're carrying
