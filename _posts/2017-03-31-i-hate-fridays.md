---
title: I hate Fridays
date: 2017-03-31 00:00:00.00 -8
---

So Fridays are typically my days off from work and school; they're awesome and I'm always looking forward to them. However, this morning I woke up to a not so awesome Friday. Everything on my computer had crapped out.

## Everything is "Damaged or Incomplete" on macOS

> "Terminal.app" is damaged and can't be opened. Delete "Terminal.app" and download it again from the App Store.

Well. WTF? Right? Now, this happened for literally all of my applications. I couldn't open Disk Utility, Terminal, Chrome, Safari. Anything. So, what did I do fix this? I logged in to my secondary admin account and had to delete my account but I kept the home directory. I then recreated the account using the existing home directory. After this, it magically fixed this. Yay. Moving on to the next issue.

## Homebrew's Broken

Alright, so what else is broken? Well, `brew`. I can run `brew install` and `brew search` however, I couldn't use `brew doctor` or `brew uninstall` and that's problematic. Here's a snippet of the error message.

```
Error: 757: unexpected token at ''
Please report this bug:
  http://docs.brew.sh/Troubleshooting.html
/System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/json/common.rb:155:in `parse'
/System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/json/common.rb:155:in `parse'
/usr/local/Homebrew/Library/Homebrew/tab.rb:62:in `from_file_content'
/usr/local/Homebrew/Library/Homebrew/tab.rb:57:in `block in from_file'
/usr/local/Homebrew/Library/Homebrew/tab.rb:57:in `fetch'
...
```

So. How did I fix this? Ugh. Fuck my life. Took me a while to finally think of this and figure out what the hell was going on but I managed to fix it by doing the following:

1. I modified this file `/usr/local/Homebrew/Library/Homebrew/tab.rb:62` and added a `puts path` as the first line of `self.from_file_content(content, path)`. I wanted to know what file was causing this to fail.
1. This will list all of the files that are being processed and the last file listed will be the one that's failing (though there may be more). It's a `INSTALL_RECEIPT.json` file that was causing me the issue with some invalid JSON somehow getting put in there.
1. I could either fix the JSON file if it was easy to fix, however it wasn't so I deleted the folder for that package and used `brew install` to reinstall it.
1. Last step, remove the `puts` after I've fixed all the broken packages.

## IntelliJ IDEs failing

Lastly. All my IntelliJ IDEs began failing. Ugh. FUCK. This was the error that I was getting.

```
#
# A fatal error has been detected by the Java Runtime Environment:
#
#  SIGBUS (0xa) at pc=0x0000000114d909b3, pid=856, tid=0x000000000000f20f
#
# JRE version: OpenJDK Runtime Environment (8.0_112-b13) (build 1.8.0_112-release-736-b13)
# Java VM: OpenJDK 64-Bit Server VM (25.112-b13 mixed mode bsd-amd64 compressed oops)
# Problematic frame:
# C  [libFontParser.dylib+0x29b3]  TSFNTFont::GetFormat() const+0x5b
#
# Failed to write core dump. Core dumps have been disabled. To enable core dumping, try "ulimit -c unlimited" before starting Java again
#
# If you would like to submit a bug report, please visit:
#   http://bugreport.java.com/bugreport/crash.jsp
# The crash happened outside the Java Virtual Machine in native code.
# See problematic frame for where to report the bug.
#
```

Now, I couldn't find a fix for this solution. The only way I was able to fix this was a clean install of macOS, just the base system; i.e. I didn't wipe any content or my disks.

## Overall

I was really hoping for a productive Friday with a proof-of-concept project I started working on this week... But I guess being productive today wasn't for me.
