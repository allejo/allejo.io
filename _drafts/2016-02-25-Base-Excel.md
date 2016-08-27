---

layout: post
title: Base Excel - A Product of College Boredom
date: 2016-02-25 00:00:00
categories: code
tags: excel sass useless

---

Ah college, a place of higher education, boredom, and parties; lots and lots of boredom. But you know what's even more boring? Going to a party and having no one to talk to. So, I gave myself a quick little task for me to do: create a new [base](https://en.wikipedia.org/wiki/Radix). Well... sorta. I call it Base Excel.

This is probably the most useless thing I've written besides my [fuck](https://github.com/allejo/fuck) command line tool. But here's how I defined Base Excel:

- Negative values and zero do not exist
- All numbers are represented by a case-insensitive A-Z alphabet. Here are some examples
    - `1   - A`
    - `26  - Z`
    - `27  - AA`
    - `53  - BA`
    - `79  - CA`
    - `702 - ZZ`
    - `731 - ABC`

Here's the general formula.

\underbrace{A}_\text{2}\underbrace{B}_\text{1}\underbrace{C}_\text{0}

(26^1)*3 + (26^0)*1
(26^2)*1 + (26^1)*2 + (26^0)*3

{% gist allejo/ffb0d0b25297f929eff4 %}
