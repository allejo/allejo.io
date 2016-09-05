---

title: Wufoo and DaPulse
date: 2015-11-07
categories: projects
tags: dapulse zapier php silex wufoo

---

At one of my jobs, we have recently moved from [Asana](https://asana.com/) to [DaPulse](https://dapulse.com/) for task management and collaboration. I'm not part of either's marketing team nor am I sponsored by either of them so I won't advocate for either or say one's better than the other. We also use [Wufoo](http://www.wufoo.com/) for forms and we used to use [Zapier](https://zapier.com/) to automatically create entries in Asana and assign them to my coworkers and myself based on the entries. At the time of writing this, Zapier falls unbelievably short with their support of DaPulse to the point where it's actually quite embarrassing and they shouldn't even be offering it in the first place.

> Somedays, you just just need Wufoo and DaPulse to work together, but the native integration either a) doesn't exist or b) doesn't do what you want.
>
> \- [Zapier](https://zapier.com/zapbook/dapulse/wufoo/)

Hah... Zapier doesn't do what I want.

I took it upon myself to write my own webhook that would actually be usable for my team. I started writing [PhpPulse](https://github.com/allejo/PhpPulse)—a PHP wrapper for working with the DaPulse API—so I would be able to make a lot more than just a link between Wufoo and DaPulse. Now, the wrapper still needs a lot of work but creating boards, pulses, notes, and updating column values all work; that is exactly what I used to build a [quick Silex project](https://github.com/allejo/AS-Webhooks) that will accept POST data from Wufoo and then create pulses with appropriate notes containing the Wufoo data. This project is far from scalable and could use a lot of thought in making it better, but for anyone else in the same situation that my team and I were in and uses PHP, this is a good starting point for you.

There will be more to come regarding PhpPulse as I finish writing support for the rest of the API and there'll also be more to come for PhpSoda. I have a smaller project planned for all of the wrappers I've started so I'll write about that once I've launched it.
