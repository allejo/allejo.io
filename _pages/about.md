---

layout: page
title: "About"
permalink: /about/

---

Hi, I'm allejo  
<small>(or allejo256 if someone has rudely taken "allejo" on a specific website)</small>

My name's Vladimir but most people just call me Vlad; well that and Asshole. I'm a computer science major in college and it's terribly boring... To keep myself busy and entertained, I do my best to contribute to open source projects and work on my own projects. I love the open source community and have been a part of it since I was 13 when I joined the BZFlag community and started writing code for it.

I'm arrogant, facetious, sarcastic, and self-centered. I'm also notorious for breaking the build.

...sometimes I'm funny.

<hr>

## Experience

{% for job in site.data.experience %}
{% include resume-entry.html %}
{% endfor %}

## Volunteer

{% for job in site.data.volunteer %}
{% include resume-entry.html %}
{% endfor %}
