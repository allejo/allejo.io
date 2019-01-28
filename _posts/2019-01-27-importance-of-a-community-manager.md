---
title: The Importance of a Community Manager
date: 2019-01-27 00:00:00.00 -8
categories:
  - rants
---

A month ago, I went on a rant about [showing your contributors some love]({{ url(collections.posts['2018-12-28-show-os-devs-love']) }}) and while I stand by that sentiment, I've learned something new in the past month: the importance of a community manager/advocate. Or just community engagement, in general.

What's happened in the past month that has led me to this new rant?

- my [PR to Docker to take down their GitHub hosted site](https://github.com/docker/docker.github.io/pull/6433) (the one I submitted in April 2018) was finally merged in 🎉
- I submitted PRs [#1109](https://github.com/Kong/docs.konghq.com/pull/1109), [#1111](https://github.com/Kong/docs.konghq.com/pull/1111), and [#1112](https://github.com/Kong/docs.konghq.com/pull/1112) to the Kong Docs fixing issues they had reported and have received silence
- Docker Docs [#7464](https://github.com/docker/docker.github.io/pull/7464) was closed with no real information from the team

So my great experiences with submitting PRs to Docker Docs and Kong Docs were due to team members who were very engaging with the community. In my last post, I mentioned [@coopr](https://github.com/coopr) and how enjoyable it was to work him. Since my last PR, it seems like he's parted ways with Kong and has started on a new adventure. Best of luck, Cooper!

What's so important about having someone engaging with the community? It's someone whose main focus will be engaging with the community, not someone volunteering their own time. Ideally, it will alleviate the burden on your developers so they can focus on writing code instead of balancing that with community engagement. Since Cooper's departure, it's felt to me like the existing PRs in that repo have received little to no attention unless the PRs were submitted by core developers themselves.

Another aspect of engaging with the community is communication and some transparency. I bring up [PR #7464](https://github.com/docker/docker.github.io/pull/7464) as an example for lack of transparency and communication. The tl;dr of that PR is that Docker is forcing you to create an account to download Docker, when it's not actually necessary to do so. Originally Docker had allowed users to download without an account but the docs team changed this with no discussion with the community and then closed the PR reverting this with the following message:

> This generated a lively discussion for the docs team; thanks for that.
>
> \- [L-Hudson](https://github.com/docker/docker.github.io/pull/7464#issuecomment-452457837)

When members of the community seem pretty adamant about an issue, I feel there should be more of a discussion and explanation when the maintainers have reached a conclusion. Don't just close something and hope people will shut up about it.

It wasn't until I recently hopped on a community call organized by a vendor we use at work that it finally hit me, whoever is leading the community engagement is really important. That call was actually enjoyable and I was taking the work of their community manager to granted. The fact that I had enjoyable interactions with my PRs before were because of the people who took responsibility for PRs from start to finish.
