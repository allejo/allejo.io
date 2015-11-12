---

layout: post
title: "Twig Date Parser Filter"
date: 2015-11-12 00:00:00
categories: code tutorials
tags: php twig symfony silex

---

I've recently been working with [joining Wufoo and DaPulse together happily in marriage]({% post_url 2015-11-07-wufoo-and-dapulse %}) and have made solid progress. However, one problem I encountered was the lack of consistency between Wufoo's POST data and API responses for their date fields. For example, I would get dates formatted as `YYYYMMDD` from the POST data received from their webhooks but I'd get `YYYY-MM-DD` whenever I sent an API request.

The problem I ran into with this was that Twig (and most likely PHP) could not create proper DateTime objects from the inconsistent data. Twig had to guess the date and I ended up getting August 20, 1970. Because a quick Google search didn't give me anything and I had to resolve this issue, I wrote a `parse_date` Twig filter to handle these types of situations.

```html
{% raw %}Date: <a href="#">{{ PostData | parse_date(["Ymd", "Y-m-d"]) | date("M d, Y") }}</a>{% endraw %}
```

You may *responsibly* give it as many possible date formats you'd like to try and it'll return a DateTime object after it finds the first valid date; this DateTime object can now be used properly with the `date` filter. This filter uses [`DateTime::createFromFormat()`](http://php.net/manual/en/datetime.createfromformat.php) to check which date format will work. This filter will also accept a single date format if you do not need to guess from an array of possible formats.

{% include source_file.html filename="DateParserFilter.php" path=page.path lang="php" %}
