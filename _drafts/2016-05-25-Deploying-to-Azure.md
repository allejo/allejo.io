---

layout: post
title: Deploying to Azure
date: 2016-05-26 00:00:00
categories: development
tags: azure github travis jekyll

---

If you're following me on GitHub, you may have noticed I have been working on [analytics.smgov.net](http://analytics.smgov.net/) ([here's the GitHub repo](https://github.com/CityofSantaMonica/analytics.smgov.net)) over the past month or so. It has definitely been a fun experience and I have learned a lot; unfortunately, the entire time I was working on this project can be summed up by this 3 second clip.

<iframe width="560" height="315" src="https://www.youtube.com/embed/LD5hMu-IsCY?rel=0" frameborder="0" allowfullscreen></iframe>

Our entire process for deploying this website is documented in the [repo's README](https://github.com/CityofSantaMonica/analytics.smgov.net/blob/master/README.md) but I'm going to go through everything related directly related to deploying to Azure from GitHub using Travis.

## Travis CI

I will assume that we all know [how to configure a GitHub webhook with Travis](https://docs.travis-ci.com/user/getting-started/), so I'll skip to configuring Travis to [deploy to Azure after a successful build](https://docs.travis-ci.com/user/deployment/azure-web-apps). Deploying to Azure requires that the following Travis environment variables are set:

- `AZURE_WA_SITE` - the name of the Azure Web App
- `AZURE_WA_USERNAME` - the git/deployment username, configured in the Azure Web App settings
- `AZURE_WA_PASSWORD` - The password of the above user, also configured in the Azure Web App settings

Super simple to configure and to get it working, right? Yes, it is. Unfortunately, I ran into some issues with deployments failing even though the site built just fine and I could deploy manually (i.e. push to Azure's git repo manually); I even confirmed my deployment account credentials were correct. I changed the deployment credentials to something silly and set Travis to output verbose information with regards to deployment.

```yaml
deploy:
  provider: azure_web_apps
  verbose: true
```

Be sure you change your credentials **before** you set the `verbose` option to true because if deployment fails, then your account credentials will be written to logs. So as I'm watching the log, I get to the deployment step and notice the git URL being used: `http://mydeploy:hi@azuresite.com`. My password was `hi Travis`. Damn spaces. Deployment failed because spaces do not play nice in that git URL. If your password has spaces or special characters, either replace them or URL encode them; git will accept URL encoded values.
