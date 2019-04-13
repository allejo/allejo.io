---
title: The Building of the New BZFlag.org
date: 2019-04-13 00:00:00.00 -8
categories:
  - projects
tags:
  - bzflag
  - stakx
---

For roughly 9 months, I had been working on the new website for [the BZFlag project](https://bzflag.org) with the help of some [awesome contributors](https://github.com/BZFlag-Dev/bzflag.org/graphs/contributors); the planning and early work started in July 2018 but full speed development didn’t really start until November 2018. On April 1st,  2019, the site was made live! I love a good and elaborate April Fools’ joke, so what better way of participating this year than by launching a completely redesigned website for a project close to my heart? I mean, I also finally released my [AOLer plug-in](https://forums.bzflag.org/viewtopic.php?f=79&t=20200) this year to troll but that’s beside the point.

So what’s the purpose of this blog post? Well, I wanted to write about everything I learned as I was building the new BZFlag site using my beloved [stakx](https://stakx.io/). This is a completely biased opinion but I must say, I built stakx to be pretty well balanced when it came to features.

## The Good and Bad of CSS

As I was writing the page templates for the new site, I needed to decide on which CSS framework to use and *how* to use it. There are enough CSS frameworks out there as there are JS dependencies but the typical contenders are Bootstrap and Foundation. My site uses Foundation and I regret that decision, so I decided to use Bootstrap. Well, **parts** of Bootstrap that is. I used their grid system and some of their utility classes because I did not want their opinionated design nor was I going to use any of their components. I wanted full control of this design and I didn’t want to bother reseting properties just to undo Bootstrap’s UI.

Utility based CSS classes are great for prototyping and they saved me so much time by not forcing me to create unique classes for every single element. I want to add left and right padding for tablets and desktops? Cool! Let me just add `px-md-3` to the element. But, what happens when I start having to create multiple copies of the same components or start having to add multiple rules or need custom rules?

Using Tailwind as an example, I’ll build the same component with and without utility classes. Mind you, this is as close as I can get to the same components using Tailwind’s default classes; once I need a more custom design, I have to do one of the following:

1. Add the styles via the inline `style` attribute
2. Create a custom Tailwind build, which means I now I have to bring in a `node_modules` folder with *at least* [80 dependencies](https://npm.anvaka.com/#/view/2d/tailwindcss) and require all developers working on the site to have Node installed in addition to PHP.
3. Create my own custom classes; at which point, why the hell am I using Tailwind to begin with?

```html
<a 
  href="#"
  class="block relative overflow-hidden no-underline"
  style="box-shadow: 0px 2px 8px 1px #000; transition: box-shadow 0.2s;"
>
  <img
    class="absolute min-h-full min-w-full" 
    style="left: 50%; top: 50%; transform: translate(-50%, -50%); transition: min-height 0.2s, min-width 0.2s; z-index:-1;"
    src="#" 
    alt=""
  >
  <div
    class="flex flex-col p-4"
    style="background-color: rgba(0, 0, 0, 0.6); height: 300px; transition: background-color 0.2s;"
  >
    ...
  </div>
</a>
```

I’m aware of all the hype behind [CSS Modules](https://github.com/css-modules/css-modules), [CSS in JS](https://cssinjs.org/), [Styled Components](https://www.styled-components.com/), and hundreds more. Please. Fucking stop. There are times it’s better just to do things "old school." Stop following the trends and **think**. Think about your project and requirements. Do you really need to bring in hundreds of dependencies *just* to build a website? The answer is a resounding no.

With the above example, I followed BEM with my CSS naming convention and all I’m using is good old Sass to generate whatever classes I need.

```html
<a href="#" class="c-hover-card">
    <img class="c-hover-card__thumbnail" src="#" alt="">
    <div class="c-hover-card__body">...</div>
</a>
```

I have Sass variables and mixins to keep consistent values throughout my classes such as margin and padding.  I have `margin()` and `padding()` mixins just so I can use them in the same way I would in HTML:

```scss
@include padding(x, 3);     // px-3
@include padding(y, 4, md); // py-md-4
```

Now, don’t get me wrong. I have utility classes in my Sass but only the ones I need:

- Borders
- Display
- Flexbox settings
- Font sizes
- Screenreader utilities
- Spacing

I designed and built stakx to be the only executable you need to get a full-fledged static site built and I have accomplished just that. Despite some of the shortcomings of [the PHP implementation of Sass](https://github.com/leafo/scssphp), such as slowness and some bugs, it’s a solid library and it’s what stakx uses at its core.

Conclusion: There is absolutely no need to bring in Node as a dependency for the majority of cases. So, please. Stop doing so.

## Collections + Searching

Just like a certain copyrighted animated individual, you want to collect them all! At its core, collections are one of stakx's most powerful feature. Some static site generators (SSGs) are designed for blogging, so collections for blog posts exist by default. Some SSGs have an opinion on *where* your collections should live and how they should be named. In stakx, there’s no such thing. You create the collections you want, named whatever you want, wherever you want, and nothing more; the BZFlag site consists of 7 collections:

- Generic Documentation
- Flags
- Slash Commands
- Developer Documentation
- API Events
- API Functions
- API Objects

Having collections in a site is no innovative concept to stakx, but what makes them so great? It’s all Front Matter (YAML) + markdown; both are pretty standard across the Internet. That means any content within these collections could be parsed and reused anywhere else. Because all of our site’s content is inside of collections, it was incredibly easy to [build a search index by generating JavaScript with our Twig templates](https://github.com/BZFlag-Dev/bzflag.org/pull/21) that would be read in by [FlexSearch.js](https://github.com/nextapps-de/flexsearch).

Let me just say. FlexSearch.js is amazing! It’s stupidly fast and powerful. It’s relatively new to the scene and for our purposes, it outshined lunr.js tremendously.

Due to [problems we had with lunr.js not being consistent with searching](https://github.com/BZFlag-Dev/bzflag.org/pull/21#issuecomment-471822614), we had to explore alternatives. We even considered having a self-hosted search engine on a separate server. But. Why?! That means it’s another service for us to maintain, theme, and host. If I haven’t made it clear already, if there’s no need to bring in unneeded dependencies, then why do so?

FlexSearch.js came to the rescue being the search engine we were looking for.

- It’s client-side, so nothing extra to maintain
- It’s stupid fast and efficient, so it’s a reasonable burden on the browser
- No dependencies! A single 6 KB minified file is all you need for the full feature set

Now, I know I’ve been going on about not having unneeded dependencies but a full-blown search engine with indexing, operators, partial matching, etc. is a necessary dependency. I don’t have the time, patience, or knowledge to implement one myself.

So how did we get to building [the search index](https://www.bzflag.org/search/index.js) source? We created a static PageView in stakx that will loop through all of our collections and build a JavaScript array of objects for FlexSearch.js to index.

```twig
{% raw -%}
---
title: Search Index
permalink: /search/index.js
---

const SearchIndex = [
    {% set uid = 0 %}
    {% for collection in site.collections %}
        {% for item in collections[collection.name] %}
            {
                id: {{ uid }},
                title: '{{ item.title }}',
                content: "{{ item.content | striptags | replace({'\n': ' '}) | escape('js') }}",
                permalink: '{{ url(item) }}'
            },
            {%- set uid = uid + 1 -%}
        {% endfor %}
    {% endfor %}
];
{%- endraw %}
```

Remember old school web development when you needed to have multiple `<script>` tags and global variables? Yup! So long as you don’t go to extremes, it’s still an acceptable practice in my opinion.

```html
{% raw -%}
<script src="{{ url(pages['Search Index']) }}"></script>
<script src="{{ url('/assets/js/flexsearch.min.js') }}"></script>
<script src="{{ url('/assets/js/search.js') }}"></script>
{%- endraw %}
```

Finally, in our `search.js`, all we need to do is create the actual FlexSearch.js object and we’re all set! We then wrote [the rest of our vanilla JavaScript](https://github.com/BZFlag-Dev/bzflag.org/pull/21/files#diff-4be111b67af9a1593260ba8451ad3653) to read from an HTML `<input>` and call `.search()` when a form is submitted.

```js
const idx = new FlexSearch({
    doc: {
        id: 'id',
        field: [
            'title',
            'content'
        ]
    }
});
idx.add(SearchIndex);

// ...
idx.search("your query", 10);
```

That’s it! We have the majority of our site’s content in appropriately nested folders, an entire client-side search engine, and only a single external dependency. Seriously, why the hell would you want to bring in Node.js, npm, Webpack, and all of those other hyped up tools when they’re not actually needed? Please stop overcomplicating the Internet!

Conclusion: Save the bandwidth for Netflix binging.

## Datasets

Datasets in stakx behave identically to collections with the exception that items in the datasets do not have bodies of content. The biggest benefit to having raw data is the fact that it can be reused anywhere else. On this site, we used a dataset to store release notes for *all* of our releases dating back to 1.7c, which was released on January 1st, 2000, in a parseable format. Moving forward, we essentially now have an authoritative change log in a maintainable and parseable format meaning we can build whatever we want with this data.

When it comes to stakx behavior, datasets behave similarly to collections meaning we can create a dynamic PageView and it'll render dedicated pages for each release from this data. And since all of the files in these datasets are parseable, if we need to manipulate the structure of the data, then we can write scripts to manipulate the data in memory and write back the changes to the files.

## JavaScript-less Syntax Highlighting

Yup, you read that heading correctly. All of the syntax highlighting for the API docs on the site are handled entirely by stakx at compile time; that means no dependency on highlight.js or Prism.js. Want to load a page without JavaScript enabled? Sure! Go for it! Our code samples will still be highlighted for you.

This is all handled by the awesome  [highlight.php](https://github.com/scrivo/highlight.php)! A project I’ve adopted and now maintain. It’s a loyal port of highlight.js written in PHP. This means two things:

- all of the language definitions are being maintained by [a mature and dedicated JS community](https://github.com/highlightjs/highlight.js/pulse); there’s no need to rewrite or update language definitions separately
- any stylesheet you find for highlight.js will work with highlight.php and therefore, stakx

## PageViews

stakx’s design philosophy is powered entirely by what are called PageViews. PageViews are essentially views in a traditional MVC pattern and stakx itself is the controller. However, these views are slightly more powerful than traditional views in which it can configure how the controller behaves.

### Collection Management (Static + Dynamic PageViews)

There are three different types of PageViews: static, dynamic, and repeater. In the BZFlag site, we only made use of static and dynamic. How did we use these two types for managing collections and datasets?

```
_pages/../<collection>/
|- list.html.twig  # Static PageView
\- show.html.twig  # Dynamic PageView
```

Let’s take the collection that contains Slash Commands docs as an example. The directory would be called `slash-commands` and there would be two files:

- `list.html.twig` - A page to list all of the available slash commands organized how we wanted them, grouped by category in alphabetical order
- `show.html.twig` - This is the dynamic PageView (or template, if you will) that will be used to display information for *each* slash command; e.g. parameters, description, version it was added, etc.

### Static PageViews

Every other page that we need for the site worked out to be static PageViews. These are pages that just need markup and won’t have its content or structure reused; e.g. the homepage. Sure the homepage will have reused components, but the page structure itself won’t be reused for another page. Unlike collections, where the pages for slash command details all have the same sections.

## Development Web Server

Now, I haven’t explored how all the SSGs out there work, so this section is based on Jekyll’s behavior. The way Jekyll works for a development server is it builds the entire site and then serves up those HTML files. I’m not sure how other SSGs handle this but stakx only parses the site’s content and starts its web server. Nothing is built.

That’s right. Absolutely nothing is built when you run `stakx serve` because why should it build the entire site? The way stakx works is it starts a web server that has an internal router. Then depending on the URL you go to, that’s the single page it will build. Yup! If you go to `localhost:8000/getting-started/` it will **only** build that page and its dependencies (e.g. CSS if Sass is used) and serve it to you. What if I change the base template of the theme that every page in the site uses? Will I have to wait for every single page to rebuild because I touched a core theme file? Don’t be silly. How does that make sense? Oh wait. Jekyll does that. Yea… stakx only builds pages as you request them. That means I can change a core theme file and the next page load will probably be a few milliseconds slower because it’s no longer cached but that’s hardly noticeable.

Is it not fair that I’m hating on Jekyll alone? Ok, fine. Come hither, JavaScript based SSGs. Let me hate on you too. Alright, let’s see. Why do I have to wait for the whole Webpack process to complete just for my development server to start? A Vuepress instance at my job takes 8 seconds to start. Seriously, how many dependencies do I need to wait to complete just to get a static site?

## Conclusion

Why should you listen to me and what I wrote in this post? You shouldn’t. After all, I graduated college less than a year ago and according to all the jobs who rejected me, I’m too young, don’t know anything, and don’t have the required amount of years of "full-time experience." Everything that I’ve learned on my own clearly means nothing, so please ignore everything you’ve read up until now.

On a less bitter note, here’s something for you to wrap your head around:

- the full BZFlag site is built by a single executable that’s less than 2MB and that you can drag and drop anywhere
	- the final BZFlag site consists of over 600 flat HTML files
- the BZFlag website will load perfectly fine and will still work without JavaScript enabled in the browser (expect for the search)
- there is a full client-side search engine that only relies on a single dependency and is built with vanilla JavaScript and the `<template>` tag
	- no Vue, React, jQuery, Webpack, etc.
- there is absolutely no use of Node or npm; with modern websites, this is blasphemy!

Please. Stop and think whether or not that framework or dependency is *really* necessary for your project. The Internet needs less overcomplicated things.

Now, in all seriousness, despite how simple or straightforward the BZFlag site seems to be built, there was a lot of thought that went into the structure and organization of it. Trust me, a lot of thought went into stakx’s behavior too.
