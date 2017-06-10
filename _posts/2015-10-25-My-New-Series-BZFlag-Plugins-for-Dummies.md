---
title: "My New Series: BZFlag Plug-ins for Dummies"
date: 2015-10-25 00:00:00
anthology: BZFlag Plug-ins for Dummies
categories: tutorials
tags: bzflag plugins development
---

Throughout my time with BZFlag, I have written a large amount of plug-ins. Nowadays, I have adopted the API as my child. By this, I mean that I have started to contribute a lot to the API and documenting it for others to use. I have also shaped certain parts of it to my liking mainly so it benefits my plug-ins.

The plug-in API was originally created by JeffM2501 with the release of BZFlag 2.0.0; such a long time ago, right? There have been many amazing plug-in authors but all of them have moved on to other projects; e.g. flying\_popcorn, LouMan, JeffM2501, and sigonasr2. I've respected all of them very highly, especially flying\_popcorn since he was the one who (patiently) taught me how to write plug-ins.

With BZFlag activity being how it is, active plug-in developers are dwindling in the community. So, I would like to change that by sharing my knowledge of the API and write about how to write your own plug-in. To do that, I'm going to start a "BZFlag Plug-ins for Dummies" series. I will be explaining things in a manner so even a nontechnical person would be able to understand it; if you're a more advanced programmer who doesn't appreciate things being written in layman's terms, either bare with me or learn on your own because you're not my target audience.

For now, I will **not** be posting this information to the BZFlag forums or the wiki. Don't worry, there isn't any juicy drama between me and the other developers and that's why I'm not posting it elsewhere; it's easier to format and design things on my blog than on the forums or the wiki.

In this series, I will be using Ubuntu but besides the initial configuration, the code will be identical and it won't matter what I use. Also, I'm going to make a few assumptions about you, the reader:

- You know some basic [C++](http://simple.wikipedia.org/wiki/C%2B%2B)
    - I will not be teaching you how to write C++; there are several people on the Internet better suited to do that
    - If you have experience with another C-style or OOP language, that may be enough
- You can install things on your computer
    - This is required so you can configure it to be a development environment
- You have some basic knowledge regarding Git
    - This isn't mandatory nor does it play a huge role, but I will not teach it for the same reason I'm not teaching C++

I will be writing this series on my spare time, so be patient if the intervals between my "chapters" aren't to your liking. Remember, BZFlag is an open source project meaning we're all volunteers that donate our time, effort, and resources so everyone can enjoy a great game; there have been certain individuals who fail to understand this concept, so I felt it necessary to put that friendly reminder.
