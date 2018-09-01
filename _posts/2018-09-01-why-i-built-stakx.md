---
title: Why I Built stakx
date: 2018-09-01 00:00:00.00 -8
categories:
  - projects
tags:
  - stakx
---

I've been wanting to write something on my blog because I haven't written anything since May and for me, that's a long time. So I decided I'd write about why I decided to create stakx.

- Arrogance: I was/am arrogant enough to believe that I could do a better job with features and design choices for how a site should be built
- Challenge: I wanted to see how difficult it would be to create my own
- Learning: I simply wanted to learn
- Burger King: I wanted to have things my way

## Static Site Generator (SSG) Comparisions

Any other sane developer would ask, "why don't you just use an existing SSG?" My answer to that is: I have used other SSGs and I found that they all fell short for my needs and wants.

- Jekyll
    - The Liquid template engine leaves *a lot* to be desired when compared to an engine like Twig
    - You *shouldn't* be using Jekyll globally and instead need to install Bundler
    - You're not supposed to modify your system installation of Ruby so you can't install Bundler without first configuring and using rbenv
- Literally any JavaScript based SSG
    - Please. No. Make it stop! As diverse as the JavaScript community may be, boy is it a dependency hell. Setting up a very simple website requires one or more of the following:
        - Install a binary "globally" with its own `node_modules`
        - Install it via `package.json` and with it, an unreasoably large `node_modules` folder per site
        - Some type of bundler/builder/task runner (Webpack, Grunt, Gulp, and friends)
- Sculpin
    - A step in the right direction, uses a powerful template engine
    - Practically a PHP based version of Jekyll but with Composer needed instead of Bundler
- Hugo
    - Hugo got things right. Single binary that you can drop anywhere and run it.
    - Their template engine? Could be improved.

## Looking Back

There are a number of things I would design differently, a lot of which I've been able to rectify in stakx 0.2.0 development. There are a number of things that I'd have a hard time changing now, so I'm stuck with them. But looking back, would I still build my own SSG if I was given the chance?

Definitely.

stakx has been one of my largest open source projects that I've worked on my own that hasn't been related to an existing community. It's been a fun experience thus far creating something like this mainly for myself.

## Is stakx for the masses?

Despite my most ambitious and obscure projects that all scream "what the hell are you doing?!" getting a lot of unexpected attention...

No. Not at all. stakx isn't meant for the masses.

While I'm designing stakx with backwards compatability in mind during breaking releases, I no longer have any dreams of stakx becoming a new hyped up SSG competitor. I'd honestly be more disappointed that my project got taken away from me by a community. It's fun making decisions without thinking of how it'd affect a lot of other people.
