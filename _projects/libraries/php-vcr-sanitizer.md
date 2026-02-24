---
name: php-vcr-sanitizer
github: allejo/php-vcr-sanitizer
categories:
    - library
links:
    - label: Packagist
      class: fa fa-box
      url: https://packagist.org/packages/allejo/php-vcr-sanitizer
languages:
  - PHP
---

php-vcr is a PHP library that records outgoing HTTP requests in unit tests and stores them in "cassettes," so they can be replayed in subsequent runs. My library overloads the default php-vcr configuration to strip sensitive information from being saved in said cassettes, e.g., emails, passwords, or API keys. Gone are the days of hoping no one steals your API keys.
