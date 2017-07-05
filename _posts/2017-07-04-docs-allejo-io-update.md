---
title: "Updates to docs.allejo.io"
date: 2017-07-04 00:00:00.00 -8
categories:
  - announcements
---

It's the 4th of July and you know what that means for me, right? It means I do my best to avoid spending time with friends and extended family. Today, I spent time improving my docs.allejo.io domain, which is used for hosting the documentation for my projects/libraries.

Here are the updates I pushed out to the domain today:

- It is now served via HTTPS only
- All URLs are served as lowercase and without the `.html` extension
  - Case sensitive URLs will automatically be rewritten as lower case
  - Links with `.html` extensions will automatically be rewritten without them
  - There should be enough redirects in place to prevent any broken links but let me know if you find any
- Documentation is now updated within minutes of commits to the project (if things don't break)

The domain is hosted on [Netlify](https://www.netlify.com/) and the repository for the configuration of this site is available under [`allejo/docs.allejo.io` on GitHub](https://github.com/allejo/docs.allejo.io). I'm using [Netlify's incoming webhooks](https://www.netlify.com/docs/webhooks/#incoming-webhooks) with [GitHub's outgoing webhooks](https://help.github.com/articles/about-webhooks/) in both the PhpSoda and PhpPulse repositories so it'll trigger a rebuild of the documentation each commit I make to these respective repositories.

There's room for improvement in this project; e.g. don't rebuild the documentation for both projects when only one project has been updated. However, it works for now!
