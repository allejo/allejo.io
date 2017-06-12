---
title: A Jekyll TOC in Liquid only
date: 2017-02-03 00:00:00.00 -8
categories:
  - tutorials
tags:
  - jekyll
  - toc
  - table of contents
  - github pages
---

So on Tuesday, I was on #jekyll like any other day and a user by the name of misty came in asking about using `{:toc}` in a Jekyll layout instead of a markdown file. It makes sense, on large websites with a lot of markdown files, you don't want to make sure you include `{:toc}` in each document and if you do manage that, you're restricted with where it will be rendered—alongside the content. There's another problem with `{:toc}`, it won't work separately from the markdown file because Jekyll doesn't give Liquid the raw markdown so you can't prepend `{:toc}` and markdownify the combination nor can you combine `{:toc}` with HTML. I'm well aware that there are several [Jekyll plugins](https://github.com/dafi/jekyll-toc-generator) out there and [JavaScript solutions](https://github.com/ghiculescu/jekyll-table-of-contents) to this problem but there are two problems with each:

1. A Jekyll plugin will not run GitHub pages
1. A JavaScript solution is slow and useless if the user doesn't have JavaScript enabled

Now I've been working with Liquid for a while and from first hand experience, I've come to realize that this quote accurately describes my experience with Liquid.

> ...like all things liquid - where there's a will, and ~36 hours to spare, there's usually a/some way
>
> \- jaybe

Now, why am I speaking about Jekyll when I'm working on [my own static site generator and even ported my website to use my tool instead of Jekyll]({{ url(collections.posts['2016-11-18-Welcome-Stakx']) }})? Well... Because I got bored and wanted to see what I could come up. Besides, I never said that I had stopped working with Jekyll sites entirely. Anyhow, I came up with the following Liquid snippet that can easily be used as an `{% raw %}{% include %}{% endraw %}` for any Jekyll site. Want to see it in action? [It's already being used on the docs.docker.com website](https://github.com/docker/docker.github.io/pull/1474).

A Liquid solution to generate a table of contents for each markdown file seems like it would be slow and it actually might be compared to a plugin solution, but compared to the overall speeds of building the current Docker docs site (~2 minutes), it's really not slow at all; there are other files that are eating up more performance than the TOC builder (at the time of writing this, they're currently working on optimizing things).

```
Filename                                          | Count |      Bytes |    Time
--------------------------------------------------+-------+------------+--------
_includes/tree.html                               |   817 | 289571.48K | 225.508
_layouts/docs.html                                |   817 | 114017.42K |  90.628
allpagelinks.md                                   |     1 |    112.33K |  19.170
_includes/toc_pure_liquid.html                    |   813 |    524.17K |   6.422
```

So I've tailored this solution to not depend on any specific front matter or `_config.yml` setup meaning all you have to do is drop in this snippet to the `_includes` folder of your Jekyll site and `{% raw %}{% include %}{% endraw %}` it with whichever parameters you want, and it'll just work.

What if you **want to** configure this snippet from your `_config.yml` or front matter? Well that's cool too but do it in your layout instead of this snippet. The goal is to keep this snippet as independent as possible so you can easily reuse it or update it and have things continue to work with any Jekyll site. As an example, in one of your layouts this is what you can do:

```twig
{% raw -%}
{% assign my_min = page.toc_min | default: site.toc_min | default: 1 %}
{% assign my_max = page.toc_max | default: site.toc_max | default: 3 %}

{% include toc_pure_liquid.html html=content sanitize=true h_min=my_min h_max=my_max %}
{% endraw %}
```

Yup! You can daisy chain `default` filters to ensure you get *some* value. In this case, we're looking for a front matter value of `toc_min` first and if that's not set, use the `toc_min` defined in your `_config.yml` and if *that's* not defined, just use 1.

## Code Snippet

At the moment, I have the [code available on a GitHub Gist](https://gist.github.com/allejo/a83bcef99a9e0a6f481fce01e492efff) for anyone to use. Whether I move the Gist to its own repository to allow for people to report issues and PRs will depend on how bored I get on a given day. Don't worry, if I do move the code, I'll update the Gist to point to the new repository. License for this snippet is BSD-3.

Feel free to leave a comment on here or on the GitHub Gist if you have any problems or if you found this awesome (or lame).

<script src="https://gist.github.com/allejo/a83bcef99a9e0a6f481fce01e492efff.js"></script>
