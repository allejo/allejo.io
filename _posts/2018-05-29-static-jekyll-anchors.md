---
title: Jekyll Heading Anchors without JavaScript
date: 2018-05-29 00:00:00.00 -8
categories:
  - projects
tags:
  - jekyll
---

Despite all my efforts for developing the next major version of stakx, I come bearing gifts for the Jekyll community. When building websites with long pages, it has become the standard to include a table of contents that link to headings. Up until [jekyll-toc](https://github.com/allejo/jekyll-toc), the only way to achieve that was through a Jekyll plugin or JavaScript. Now, the current solution for adding clickable links next to headings is to use JavaScript. Let's change that.

There are too many _static_ websites out there that load a lot of JavaScript to the point where it slows down. Why? Seriously. Stahp that. I mean, I'm even planning on moving away from Disqus solely because it loads too much. Anyhow, websites like these cause me to navigate it with JavaScript disabled but that often leads to me not being able to click on a permalink for a heading. Taking the same behavior and concept from **jekyll-toc**, I've built [jekyll-anchor-headings](https://github.com/allejo/jekyll-anchor-headings).

If things can be achieved without resorting to JavaScript, why not do it?

## TL;DR

The code is available on GitHub: [allejo/jekyll-anchor-headings](https://github.com/allejo/jekyll-anchor-headings).

## Usage

Usage is simple, instead of using `{% raw %}{{ content }}{% endraw %}` to display your page's content (your rendered markdown, i.e.) you would feed `{% raw %}{{ content }}{% endraw %}` into the [`anchor_headings.html`](https://github.com/allejo/jekyll-anchor-headings/blob/master/_includes/anchor_headings.html) include.

```twig
{% raw %}{% include anchor_headings.html html=content %}{% endraw %}
```

The snippet is available in the GitHub repo and has unit tests as well. We have to be sure that things continue working as expected with variations of HTML.

## How it Works

Since **jekyll-toc** has worked out pretty robustly, I've taken a lot of [the same concepts]({{ url(collections.posts['2017-02-03-jekyll-toc']) }}#how-it-works) and code from that project and adapted it to work with this new project.

### Step 0

Taking steps 1 through 6 from the [previous post]({{ url(collections.posts['2017-02-03-jekyll-toc']) }}#how-it-works), we currently have access to the `id` attribute and the contents of the actual headings (e.g. `h1`).

### Step 1

First, we build an anchor tag manually as a string by setting the `href` attribute along with `class` and `title`. So at this point, we'll have the following:

```
href="#some-id" class="my-class permalink" title="click me!"
```

### Step 2

Now, we'll take that string and simple prefix `<a` and append an `></a>` with possibly some content in between the anchors.

### Step 3

We do some stupid string replacements to change the current heading tags (`h1` - `h6`) with some that we build on our own with:

- The custom anchor we built in steps 1 and 2
- The heading content we have from step 0

## Conclusion

Check out the [project on GitHub](https://github.com/allejo/jekyll-anchor-headings) and give it a shot on your own website! There's no need for you to understand the craziness of manipulating HTML as strings, just `{% raw %}{% include %}{% endraw %}` in your layouts and you're set!
