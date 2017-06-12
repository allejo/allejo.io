---
title: Introducing PhpSoda
date: 2015-06-10 00:00:00
categories:
  - projects
tags:
  - socrata
  - php
  - library
  - api
---

I'm very proud to announce the birth of a new project and its [first release](https://github.com/allejo/PhpSoda/releases/tag/v0.1.0)! It's called [PhpSoda](https://github.com/allejo/PhpSoda) and it's not for the type of soda that you drink (even though I *love* soda), it's actually an acronym for the [Socrata Open Data API](http://dev.socrata.com/). What's [Socrata](http://socrata.com/)? Well they're a pretty neat company that hosts a lot of open data for governments. They host open data for the [US Federal Government](http://www.socrata.com/industries/open-data-federal-governments/) and for local governments like the [City of Santa Monica](https://data.smgov.net/), where I work at the time of writing this.

At my job, we use C# for everything development and my coworker contributed the [.NET library](https://github.com/CityofSantaMonica/SODA.NET) to the Socrata community because the library that existed before had room for some changes and refactoring. Similarly, Socrata has an official PHP library for working with the API but... It had plenty of shortcomings and it wasn't written in a very object oriented fashion. While I'm definitely not one to talk, I felt that it only contributed to the reputation of bad PHP code. I decided to write my own PHP library and [send a pull request](https://github.com/socrata/dev.socrata.com/issues/234) to have my library listed under the "[Community Libraries](http://dev.socrata.com/libraries/)" section of the Socrata developer website.

Socrata is mainly aimed at the public sector and I know PHP isn't too common in the public sector but for the PHP enthusiasts out there, I hope this library helps! I'm always open to suggestions and feedback, just [submit an issue](https://github.com/allejo/PhpSoda/issues) and I'll be glad to discuss things.

I have spent hours documenting my library so please check out the Wiki and install the package via Composer!

- [Packagist](https://packagist.org/packages/allejo/php-soda)
- [Wiki](https://github.com/allejo/PhpSoda/wiki)

I'm ecstatic to see my library listed on their website! This has been the first library I've written and one of my first standalone open source projects not related to BZFlag or WordPress. I plan on extending my horizons a bit further with some more projects I have in mind that I will open source, so stay tuned... This is exciting!
