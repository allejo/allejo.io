---
title: Welcome Stakx
date: 2016-11-18 00:00:00.00 -8
categories: 
  - projects
tags: 
  - stakx
---

A [while back]({{ url(collections.posts['2016-03-08-Evidently-I-have-a-life'].permalink) }}), I mentioned that I was working on my own [static website generator](https://github.com/stakx-io/stakx) and that I was going to post about it later. For the past 6 months, I've been working on Stakx on and off and I've finally reached a point where I can easily and efficiently build a website with Stakx.

My personal website is actually the third website I've built with Stakx; the first website was the [Associated Students' Sustainability Center website](http://csunas.org/sustainabilitycenter/). I've been wanting to redesign my website and continue building upon it so it could serve as my portfolio for my work for quite some time now, so in honor of Stakx becoming usable, I'd like to introduce my completely redesigned website! In addition to the new design, I've gone back through my previous posts and have updated them to work with Stakx or removed some of the more sillier posts; not that many people read my posts or would care.

So why exactly did I build yet another static website generator? Well of all the more popular generators out there, each one that I've tried has had shortcomings whether it's the template engine or the organization the generator expects. I didn't write Stakx as a tool that will replace Jekyll in my life, but more so as an alternative to the available tools already out there. I wanted a tool that used a powerful template engine, doesn't require a package manager to build a website, and can be distributed as just a single executable.

## Stakx vs Jekyll

I'll be writing a more in-depth document regarding the differences between Stakx and Jekyll on the official Stakx website but here are some things I immediately ran into as I was porting over my website to Stakx.

### No `{% raw %}{% post_url %}{% endraw %}` tag

Jekyll has this Liquid tag available to reference other posts, but Stakx does not have this and it's not an oversight on my part when I was designing it. A link to another collection item can be achieved with Twig alone. In addition, you're not limited to just accessing other posts and their links, you can access any Content Item from any Collection and access all of their attributes.

```twig
{% raw %}{{ url(collections.posts['file-name-without-extension'].permalink) }}{% endraw %}
```

I admit, not the most elegant method of accessing the permalink of another Content Item, but it is functional. In addition, Twig allows you to define macros, which is similar to Jekyll's include functionality, to create a shortcut of sorts to access permalinks with less markup.

```twig
{% raw %}{%- macro item_url(collection, file) -%}
    {{ url(collections[collection][file].permalink) }}
{%- endmacro -%}

{{ _self.item_url('collection-name', 'file-name-without-extension') }}{% endraw %}
```

### No `{% raw %}{% gist %}{% endraw %}` tag

There is no custom Twig tag to fetch a GitHub Gist's content and embed it on the page at compile time without the need of having JavaScript enabled for your website readers. GitHub, however, does let you embed Gists on your page by simply pasting a script tag with information such as your GitHub username and Gist ID.

```html
<script src="https://gist.github.com/:username/:gist-id.js"></script>
```

### Twig plug-ins?

I do have plans for supporting custom Twig filters and tags by adding support for extending Stakx but that will have to wait for a future release.

- **Will both of these features be written and supported as plug-ins?**  
  Probably.

- **Will these become part of Stakx core?**  
  Possibly, being able to reference other Content Items is important and it should be an easy task for users

## Moving Forward

I have learned a lot by building Stakx and there is a lot I can still improve on, such as using dependency injection instead of explicitly passing objects. I have every intention of continuing to develop and support Stakx for the forseeable future. However, Stakx is still very young so I don't think porting a large existing Jekyll website, for example, to a Stakx website would be worth the effort. At the moment, I'd recommend Stakx to be used for new small scale websites or for experimentation.

If anyone discovers Stakx and builds a website with it, I would love to know! Leave a comment on here or give me feedback by creating [an issue on GitHub](https://github.com/stakx-io/stakx/issues).
