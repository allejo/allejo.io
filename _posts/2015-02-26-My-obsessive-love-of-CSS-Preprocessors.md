---

layout: post
title:  "My obsessive love of CSS Preprocessors"
date: 2015-02-26 02:03:50 -07:00
categories: blog rants
tags: coding sass less css
redirect_from:
  - /blog/rants/2015/02/25/Obsessive-love-of-CSS-Preprocessors.html

---

Contrary to [Ashvala](http://ashvala.net/), whom is like Yamcha while I'm like... Errr. Ok, well. Let's put it this way, we're acquaintances and we "tolerate" each other; he's a douche.

Anyhow... I absolutely love CSS preprocessors. They are amazing. I could not work without them. I would lose my sanity. Regular CSS is a burden and tedious to write and maintain and so my love for SASS (SCSS specifically) began. Now, I'm not going to write a post as to why you should use a preprocessor, there are plenty of those out there. So in order to stay original, I'm going to give you my blatantly biased opinion of why I choose SCSS over LESS even though I work with both and why I'm not particularly fond of Bootstrap.

Throughout this post, I will be referring to SCSS as SASS because technically that's what it is. When comparing LESS and SASS together, there are a lot of similarities and a lot of differences. I use SASS by choice in all of my web design projects and I use LESS for all of my projects at work. To me, the syntax SASS uses is far better and than LESS because it simply makes more sense to me.

### Functions

Both SASS and LESS support functions (or mixins) and I love them both to death, the result is difference but what really bugs me is the syntax.

**SASS**

``` scss

@include my-function;

```

or

``` scss

@include my-function();

```

**LESS**

``` scss

.my-function;

```

or

``` scss

.my-function();

```

In CSS, the period already has a special meaning and using it to signify both a class and a function is absurd. I personally find this very annoying and confusing at the same time, where SASS' syntax makes a lot more sense if you're coming from a C style mentality. Even if you've never worked with C, I mean `@include` just makes sense... It's readable to someone even if they've never used SASS even though it may not make sense on how it works or what it does.

### Foreach Loops

Oh for fuck's sake. One of the most useful and fundamental things in most language are loops. Make them easy to use. Seriously. What in the actual fuck.

**SASS**

``` scss
.example_module {
    @each $color in green, red, blue {
        &.#{$color} {
            background: $color;
        }
    }
}
```

**LESS**

``` scss
@colors: 'green', 'red', 'blue';

.example_module {
    .-(@i: length(@colors)) when (@i > 0) {
        @name: e(extract(@colors, @i));
        &.@{name} {background: @name}
        .-((@i - 1));
    } .-;
}
```

Seriously? Are you really going to argue this? Fuck you LESS. WHY?! You don't have to be an experience programmer to see how unreasonable this is. There is a [foreach loop](https://github.com/seven-phases-max/less.curious/blob/master/src/for.less) snippet that can be used to achieve a slightly better syntax but there shouldn't be a need to have to find a seperate code snippet just to have a somewhat sane syntax.

### Namespaces

Namespaces in SASS/LESS are weird concepts; they are entirely different from each other. Suffice to say, I have a bone to pick with LESS for allowing namespaces; well, sorta. LESS allows you to bundle mixins within a namespace and while it's handy with OOP languages, I don't think it's quite necessary for CSS. There was a [request](https://groups.google.com/forum/#!topic/sass-lang/9RSxJrtvMIo) to support namespaces in SASS and while the idea may be nice, I would not agree that it's a good idea. Don't get me wrong, I love organization and I do my best to organize all of my code but it'd become a bit ridiculous with CSS.

> "I don't think anyone wants to write `@import compass.helpers.selectors.nest(".foo", ".bar")`"
>
> -- [Natalie Weizenbaum](https://groups.google.com/d/msg/sass-lang/9RSxJrtvMIo/bqXHzY9pUPMJ)

Here's what using namespaces look like in LESS.

``` scss
#bundle {
  .button {
    // ...
    &:hover {
      // ..
    }
  }
  .tab { ... }
  .citation { ... }
}
```

If it's absolutely necessary to organize your mixins or need to avoid conflicts, add a prefix to the mixins; it's not that hard. If SASS libraries such as [Bourbon](http://bourbon.io/) and [Neat](http://neat.bourbon.io/) can survive easily without using a namespace or prefix, then I'm sure your mixins are fine.

``` scss
@mixin bundle-button () { ... }
@mixin bundle-tab () { ... }
```

And another thing! When I write my SASS/CSS, I never use IDs; I feel like they should solely be used for JavaScript. Stylesheets should have reusable styles, not something only usable for a single element. I'm not going to argue this since there are plenty of debates concerning this like this one on [StackOverflow](http://stackoverflow.com/questions/8084555/why-selecting-by-id-is-not-recommended-in-css). But there you go again, LESS, you just *had* to use a selector that already has meaning in CSS to signify a namespace.

### SASS' @content blocks

Of the several features that SASS has, one of the features I appreciate is the `@content` block. If you're not familiar with it, you can use it to create mixins, give it a set of rules, and the mixin will pass the set of rules as a parameter, so to speak. For example, here's a [mixin I've written](https://github.com/allejo/bzion/blob/master/web/assets/css/modules/_mobile-responsive-definitions.scss) and use repeatedly on several different projects, one of them being [BZiON](https://github.com/allejo/bzion).

**SASS Definition**

``` scss
@mixin respond-to($media) {
    @if $media == phones {
        @media only screen and (max-width: $phone-max-size) { @content; }
    }
    @else if $media == phablets {
        @media only screen and (max-width: $phablet-max-size) { @content; }
    }
    @else if $media == tablets {
        @media only screen and (max-width: $tablet-max-size) { @content; }
    }
}
```

**SASS Usage**

``` scss
.display-on-phone-only {
    display: none;

    @include respond-to(phones) {
        display: block;
    }
}
```

Oh don't worry, LESS has this feature as well! It supports it just like it supports loops... As I'm writing LESS and using this syntax, I'm forced to tolerate it but it simply doesn't feel natural to me. At this point, it feels like I'm writing JavaScript with all of the anonymous functions.

**LESS Definition**

``` scss
.respond-to(@media-size, @rules) {
    & when(@media-size = phones) {
        @media only screen and (max-width: @phone-max-size) { @rules(); }
    }
    & when(@media-size = phablets) {
        @media only screen and (max-width: @phablets-max-size) { @rules(); }
    }
    & when(@media-size = tablet) {
        @media only screen and (max-width: @tablet-max-size) { @rules(); }
    }
}
```

**LESS Usage**

``` scss
.display-on-phone-only {
    display: none;

    .respond-to(phones; {
        display: block;
    });
}
```

### Final Thoughts

While I am forced to work with LESS for my job and I've grown to tolerate it, I still much prefer SASS. I honestly think the Bootstrap team should have used SASS instead so LESS could have died... The sole reason LESS was revived was because Bootstrap used it. I'm fully aware why the Bootstrap team [choose to use LESS](https://web.archive.org/web/20140708195223/http://www.wordsbyf.at/2012/03/08/why-less/) over SASS but I still don't agree with some of their reasoning.

1. "LESS is simple"
    - Look at the LESS loop...
2. LESS is only "a stopgap" until the future of CSS
    - "stopgap", you keep using that word, I do not think it means what you think it means. CSS spec shows no real signs of improvements in the direction of supporting things that preprocessors support; this is a joke.
