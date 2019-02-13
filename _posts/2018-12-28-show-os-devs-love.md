---
title: Show Your OS Devs Some Love
date: 2018-12-28 00:00:00.00 -8
categories:
  - rants
---

I've been lurking around the open source community for about a decade now. I say lurking because I feel like I lurk more than I actually contribute. Though, judging by the little squares on [my GitHub profile](https://github.com/allejo), I am by definition: fairly active. My favorite time of the year is Hacktoberfest because I do my best to find a community I don't typically hang around and see if I can contribute. Sure, I could always go to those "we'll accept any PR during Hacktoberfest" repositories, but where's the fun in that?

In the past, I really enjoyed making random appearances in the [Docker Docs repository](https://github.com/docker/docker.github.io) in unexpected ways.

- I wrote an [insane Liquid-only TOC generator for them](https://github.com/docker/docker.github.io/pull/1474) that later became [its own project](https://github.com/allejo/jekyll-toc) that's now become my legacy...
- I won [second place in their 2017 Docker Docs Hackathon](https://docs.docker.com/hackathon/#overall-winners) by contributing a [complete rewrite of the site sidebars](https://github.com/docker/docker.github.io/pull/2860)
  - This PR alone fixed four issues: [#2002](https://github.com/docker/docker.github.io/issues/2002), [#2232](https://github.com/docker/docker.github.io/issues/2232), [#2403](https://github.com/docker/docker.github.io/issues/2403), and [#2692](https://github.com/docker/docker.github.io/issues/2692)
  - Additionally, it also fixed [not one](https://github.com/docker/docker.github.io/pull/2860#issuecomment-295872145),  [not two](https://github.com/docker/docker.github.io/pull/2860/commits/ef16138cfb471b8659e8e76661508740d1bb36da), but [three](https://github.com/docker/docker.github.io/pull/2860/commits/b307c2c8f1bd33f0bb0af9cdeb41cd9df3d8dd41) additional findings that didn't have respective issues yet

So if you're browsing the Docker Docs site and enjoy how smoothly the sidebars work with scrolling, how that hamburger actually appears at a reasonable breakpoint, or if you're maintaining the source and you like how the navigation for the _entire_ site is now in a single include... You're welcome.

I loved the Docker Docs team at the time. I wasn't in any way affiliated with Docker, but they'd reach out to me from time to time with questions. I loved it. I was in college, so I needed something to keep me busy during my mundane classes and they gave me just that. Heck, they even [sent me some free swag](https://www.instagram.com/p/BSClaRZAfwU/); thanks Misty!

As with anything in life, things change. My favorite docs team members left to other companies; good for them! I figured I'd continue to make appearances regardless so back in April 2018, I submitted [a PR to take down the GitHub pages hosted version of the site](https://github.com/docker/docker.github.io/pull/6433); something [they'd been asking for help with](https://github.com/docker/docker.github.io/issues/6101). At the time of writing this, the PR remains open and mostly untouched.

For Hacktoberfest, I looked through the PRs to see if the one I had created in April had finally been merged or closed. Maybe I missed the notification? Nope. Untouched since April. A few days later, it was bumped on the 4th. I thought to myself, "Ok, I guess taking down the GH version of the site might take some _long_ internal discussion." I work for the government, I'm used to slowness in decision making. In the spirit of Hacktoberfest, I decided I'd try fixing some site bugs. I submitted [PR #7496](https://github.com/docker/docker.github.io/pull/7496), which would fix the [browser history spam you'd get as you scrolled through __any__ page](https://github.com/docker/docker.github.io/issues/6299). Fast forward 2 months. Untouched. No comments. No labels. No assignments.

&lt;sarcasm&gt;Man, I'm really feeling the love from the Docker Docs team...&lt;/sarcasm&gt;

Since I make it a personal goal to contribute to new communities during Hacktoberfest, I found Kong Inc. who was [looking for a way to automate creation of Table of Contents on their GitHub pages hosted site](https://github.com/Kong/docs.konghq.com/issues/894). Doesn't that sound familiar to another community I once helped out? I submitted [PR #920](https://github.com/Kong/docs.konghq.com/pull/920) and I had such an enjoyable experience in doing so! Working with [@coopr](https://github.com/coopr) was so productive! I had questions on how they wanted something implemented, they had answers and feedback quickly! It took about 13 days to iron out this PR and get things "just right" but it was well worth it. Not only did Kong get a new feature on their documentation site, it was discovered that there were many improvements and updates needed throughout. These were tackled by other members of the community in the coming days. Now that's what I call collaboration.

A few days later after my PR was merged, I get pinged on Twitter by the Kong account thanking me for adding the auto-TOC feature to their site. Then much much later, I get pinged once again telling me about how [they mentioned me in their blog post](https://konghq.com/blog/hacktoberfest-kong-community-delivers/). Kong gave me more attention than my parents ever did; it's such a nice feeling to be loved.

<div class="grid-x grid-margin-x">
  <div class="cell medium-6">
    <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Huge thank you to <a href="https://twitter.com/allejome?ref_src=twsrc%5Etfw">@allejome</a>, who added automatic table-of-contents generation to our documentation as part of <a href="https://twitter.com/hashtag/Hacktoberfest?src=hash&amp;ref_src=twsrc%5Etfw">#Hacktoberfest</a>! Contributors like you are the stars of <a href="https://twitter.com/hashtag/OpenSource?src=hash&amp;ref_src=twsrc%5Etfw">#OpenSource</a>! Wondering what to work on to earn a contributor t-shirt?👕🎃🦍<a href="https://t.co/Rt1JBSl7kP">https://t.co/Rt1JBSl7kP</a></p>&mdash; Kong (@thekonginc) <a href="https://twitter.com/thekonginc/status/1053738625807081473?ref_src=twsrc%5Etfw">October 20, 2018</a></blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  </div>

  <div class="cell medium-6">
    <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Really feeling the love, <a href="https://twitter.com/thekonginc?ref_src=twsrc%5Etfw">@thekonginc</a> 🥰 thanks for the mention in this! <a href="https://t.co/hoVNFuTZI9">https://t.co/hoVNFuTZI9</a></p>&mdash; Vladimir Jimenez 🇨🇦🧐 (@allejome) <a href="https://twitter.com/allejome/status/1070503389543321600?ref_src=twsrc%5Etfw">December 6, 2018</a></blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  </div>
</div>

So what's the moral of this story?

- Thank your open source contributors! A simple "thank you" when your merge their PR goes a long way. Tag them in release notes. Give them credit!
- Be responsive and kind to PRs. Remember, people are taking time out of their day to contribute to your project. So be responsive and give them feedback. A PR will likely not be mergeable on the first try, so give them feedback on what to do to make it mergeable. There's nothing more satisfying to me than getting feedback from a team of a project I care enough about to contribute to.

It's really that simple. In this story, Kong Inc. went above and beyond with showing me so much love in everything they mentioned me in and I appreciate all of that! I'm really feeling the love from Kong. There's not a doubt in my mind that I'd return to the Kong community far quicker and more willingly than I would the Docker one.
