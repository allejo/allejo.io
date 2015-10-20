---

layout: post
title:  "LESS Flexbox"
date:   2015-03-24 00:00:00
categories: blog code
tags: less flexbox css autoprefixer

---

So I've become a huge fan of Grunt, the JavaScript task runner, and I use it in pretty much all of my web projects nowadays. I ran into [Autoprefixer](https://github.com/postcss/autoprefixer) when I was looking at CSS tools and I decided I'd give it a shot and it's quite promising but... It doesn't properly support all of the Flexbox specifications (mainly the 2009 and 2011 specs). What does this mean? If I rely on Autoprefixer to generate the CSS for old specs of Flexbox still used by IE 10 or Safari or iOS, then I'm screwed.

I've fallen in love in flexbox and how neatly it works so I've started to use them in websites that don't need to support less than IE 10; e.g. [BZiON](https://github.com/allejo/bzion). I tried on relying on Autoprefixer to generate and faced issues and had to use Bourbon instead as you can see in commits [`2c47011`](https://github.com/allejo/bzion/commit/2c470112a14e2737448868b8ff7b72bee2513c6b) and [`ec8ab25`](https://github.com/allejo/bzion/commit/ec8ab2560330ead0566379464450d5c71c46adbc).

I use [Thoughtbot's Bourbon library](http://bourbon.io/) for all of my SASS projects and use this [repo](https://github.com/Sujevo/lib-bourbon) as a submodule for using Bourbon in my project. Anyhow, [as I've mentioned before]({% post_url 2015-02-26-My-obsessive-love-of-CSS-Preprocessors %}), I use LESS at one of my jobs so I unfortunately can't use Bourbon for this project and I had to use flexbox to support a snippet of code I had written. I tried to use Autoprefixer but once again, it failed me with flexbox's older specs and lacked IE support. I searched for a solution similar to Bourbon for LESS to support flexbox's older specs but couldn't find anything and so I put effort into porting Bourbon's flexbox mixins to LESS. Since I may not be the only one looking for this solution, enjoy!

{% gist b4b0ab3b64b6a882e227 _prefixer.less %}
{% gist b4b0ab3b64b6a882e227 _flexbox.less %}
