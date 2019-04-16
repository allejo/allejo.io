---
title: A Jekyll TOC without Plugins or JavaScript
date: 2017-02-03 00:00:00.00 -8
categories:
  - tutorials
tags:
  - jekyll
  - toc
  - table of contents
  - github pages
redirect_from:
  - /blog/a-jekyll-toc-in-liquid-only/
---

So on Tuesday, I was on #jekyll like any other day and a user by the name of misty came in asking about using `{:toc}` in a Jekyll layout instead of a markdown file. It makes sense, on large websites with a lot of markdown files, you don't want to make sure you include `{:toc}` in each document and if you do manage that, you're restricted with where it will be rendered—alongside the content. There's another problem with `{:toc}`, it won't work separately from the markdown file because Jekyll doesn't give Liquid the raw markdown so you can't prepend `{:toc}` and markdownify the combination nor can you combine `{:toc}` with HTML. I'm well aware that there are several [Jekyll plugins](https://github.com/dafi/jekyll-toc-generator) out there and [JavaScript solutions](https://github.com/ghiculescu/jekyll-table-of-contents) to this problem but there are two problems with each:

1. A Jekyll plugin will not run GitHub pages
1. A JavaScript solution is slow and useless if the user doesn't have JavaScript enabled

## TL;DR

The code is available on GitHub: [allejo/jekyll-toc](https://github.com/allejo/jekyll-toc).

## Overview

Now I've been working with Liquid for a while and from first hand experience, I've come to realize that this quote accurately describes my experience with Liquid.

> ...like all things liquid - where there's a will, and ~36 hours to spare, there's usually a/some way
>
> \- jaybe

Now, why am I speaking about Jekyll when I'm working on [my own static site generator and even ported my website to use my tool instead of Jekyll]({{ url(collections.posts['2016-11-18-Welcome-Stakx']) }})? Well... Because I got bored and wanted to see what I could come up. Besides, I never said that I had stopped working with Jekyll sites entirely. Anyhow, I came up with the following Liquid snippet that can easily be used as an `{% raw %}{% include %}{% endraw %}` for any Jekyll site. Want to see it in action? It's already being used on [the docs.docker.com website](https://github.com/docker/docker.github.io/pull/1474) and [the UK Ministry of Justice Technical Guidance site](https://github.com/ministryofjustice/technical-guidance/pull/7).

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

## How It Works

This snippet is designed to work with markdownify-ed HTML given to us by Jekyll. Due to the way Jekyll was designed, you can't access the unrendered markdown of a document and are stuck with HTML.

### Step 1

The very first step is to find all of the headings in the given HTML. To do so, I start off by spliting the HTML at every `<h`. This is my way of cheating and finding all of the headings in the given HTML and now we have an array that looks like this:

```
[
    '1 id="heading-1">Heading 1</h1><p>....</p>',
    '2 id="hello">Hello</h2><p>...</p>'
]
```

### Step 2

At this point, I loop through each array item (I call it a 'node' in the code). I slice the string to get the first character, which is the heading level. I then do some Liquid magic to cast the sliced string into an integer by multiplying the string by 1.

### Step 3

Now that we have the heading level as an integer, respect the `h_min` and `h_max` parameters and toss any headings we don't want by moving on to the next node if necessary.

### Step 4

Now, I split each node at the `</h` and only keep what's on the left side of the split. So now I have an array of nodes that look like this.

```
[
    ' id="heading-1">Heading 1',
    ' id="hello">Hello'
]
```

### Step 5

I now split the nodes by `"` and I access index 1 of that split, which will give me access the generated ID for that heading (thank you kramdown for this); i.e. `heading-1` and `hello`.

### Step 6

Now that I have the heading level and the ID, it's time to extract the actual heading content. So I build what the node looked like in step 4 up until the `>`, and replace it with nothing. Voilá. I've extracted the heading content.

### Step 7

Now that we have all the necessary information, all we have to do is actually build the TOC. Here's the trick, we build our TOC using markdown (e.g. `- [text](#id)`). I take the heading level for the current node, and subtract one. I then take that value (X) and repeat 2 spaces X times; this serves as our indentation.

For example, for our `h2` becomes `2 - 1 = 1`. Then I repeat 2 spaces 1 time. So our generated markdown would look like this:

```md
- [Heading 1](#heading-1)
  - [Hello](#hello)
```

### Step 8

Lastly, now that we have a markdown version of the TOC with the correct indentation, we `markdownify` it and output that. And, that's it! Pretty cool, right?

## Project Repository

I originally shared this code as a GitHub Gist, however I made a promise months ago regarding this code. If I got bored enough, I'd move the code to its own repository; and so I have: [allejo/jekyll-toc](https://github.com/allejo/jekyll-toc). Heck, I even added unit tests to show sample usage and make sure that it works as intended. Don't worry, the snippet's still under BSD-3.

**Updates**

- <small>2017-09-07 - Updated post with an overview of how the code works and updated links to the new GitHub repository</small>
