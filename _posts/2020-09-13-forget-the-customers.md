---
title: Wait, We Have Customers?
date: 2020-09-12 00:00:00.00 -8
categories:
  - rants
---

I have never worked retail in my life and for that, I am very grateful. Trust me, with my sarcasm and attitude, you do not want me working in retail. If you work in retail, you have my full respect; I could never do what you do. Working on a college campus, something I see very often is that employees forget who we're working for and who our customers are.

For those of you who know me, I'm excruciatingly honest and rarely ever filter myself; this trait of mine has gotten me in trouble at work plenty of times. This post isn't meant to be philosophical but I believe we're in our current state because no one spoke up early on when important decisions were being made and things just became the norm.

## Describing a College Campus

As much as I would love to air all of the dirty laundry I'm privy to about the college campus I work on, that's considered taboo. I'm sorry, let's call it "whistleblowing" instead. Sounds worse, am I right? Everyone has different opinions about what's ethical and what's not. Is tell something that whistleblowing is the same as "career suicide" ethical? Depends on who you ask. But I digress.

The college campus I work at is huge; it's got enough employees to populate a small town. I'm a developer, so of course, I work for the IT department. But wait. Which one? Practically every department on campus has its own IT team and then, of course, we have the central IT department in charge of maintaining the core infrastructure for the campus (that's where I work). Our separate IT teams on campus work together as well as the "checks and balances" system of the US government: it's nice in theory but terrible in practice. Sorry, third graders, that was a spoiler.

## Customers on a Campus

Who are the customers for a college campus? If you guessed, "students," then you're right! Actually, in theory, you're right. When it comes down to it, I genuinely do not believe that the employees of a college campus remember that students are our "customers." They're literally paying thousands of dollars and funding the salaries of employees and yet... They're not treated as customers? How does that make sense?

The battles students need to fight against the administration amazes me. Some students can get through their college careers with no problems but others, face a plethora of obstacles. Have you ever tried transferring credits between colleges? Let's say you're transferring from College A to College B. You are literally at the mercy of College B's discretion on whether or not College A's teachings live up to College B's standards. What happens if your credits are rejected? Then you have to take the classes again at College B.

> But there are charts published by colleges stating which credits they will and will not accept!

Listen to yourself. Let that sink in. Colleges are literally publishing what they think about other college's coursework. This is a battle between colleges and students are caught in the middle of it. This is a fundamental problem with the education system not being standardized.

> Those published charts are _literally_ standardization of what is being taught. That's why colleges have those charts.

It's cute you think that. Have you ever read a syllabus at the beginning of a semester and thought to yourself, "wow! That sounds so cool! I'm going to learn so much in this class." but by the end of the semester, you realize that everything on the syllabus was either a lie or blown out of proportion.

It's these syllabi that are agreed upon between campuses. This is why making changes to them are very painful because they need to be "reevaluated" by other colleges and other colleges need to change their own syllabi to teach the same material or reject it and no longer accept transfer credits.

If you were at Starbucks being thrown so many obstacles, you wouldn't accept this atrocious mess. So then why do people accept it as "the norm" for colleges treating their students like they don't matter? Students are the reason we are getting paid. We should not be making their lives incredibly difficult and wasting their time.

## A Sharing Development Culture

"Culture" is the word that every managerial figure loves to hear and boasts about. I agree that we have a culture on campus, however, I would add an adjective to it: toxic.

Why did I originally bring up working in IT and other IT teams on campus? One of the biggest problems I see is that people in IT forget that students are our customers. Well, not directly. The IT teams I'm talking about build and manage things for faculty and administration that then help those users provide services for students. This is how people forget we're ultimately serving students.

The vast majority of the tools I work on are intended to be used internally by campus employees to make their lives easier so that _they_ can make things better for students. If you have ever worked with me or seen my work on GitHub, you probably know that I absolutely love building things in a modular way. _Incredibly_ modular; but not a "dependency hell" type of modular either. Please don't question my judgment, that's what my parents are for. As an example of something modular that I've built, let's look at my "BZFlag Plug-in Starter" that consists of three separate projects:

- [aclovis](https://github.com/allejo/aclovis): a library for generating C++ code via JavaScript. This project has enough interfaces where it can be expanded to generating other languages too if I wanted to.
- [bzfPluginGen](https://github.com/allejo/bzfPluginGen): a library that uses _aclovis_ to generate the source code for a BZFlag plug-in.
- [BZFlag Plug-in Starter](https://github.com/allejo/bzflagPluginStarter3): a React website that uses _bzfPluginGen_ to let users generate plug-ins by clicking buttons.

All of these tools build on top of each other and can be expanded on their own! aclovis can be expanded to support other languages. bzfPluginGen can be updated to generate a new C++ syntax. BZFlag Plug-in Starter can be updated to have an entirely different design. It may seem like overkill but they all live in their own separate projects with a single purpose in mind. I have plenty more examples on GitHub but the point is, many of my tools at work are this modular.

There are plenty of tools that my colleagues have built as well that can be useful to other departments if shared! It's this type of sharing that is currently discouraged. Wait what? _Dis_-couraged? Yes. This is one of many reasons why our current culture is toxic. We are forcing everyone to work in silos because nobody wants to take responsibility for maintaining shared tools.

> If we release it to other teams and they find a bug, do we have to drop everything and fix it for them?

No! Who the hell makes those types of guarantees? Even Microsoft doesn't fix that [one bug in Microsoft Excel that drives your industry insane](https://www.theverge.com/2020/8/6/21355674/human-genes-rename-microsoft-excel-misreading-dates). So why should you? You are not making any guarantees by sharing your code. What you are doing is saving other people time. In the future, their teams may work on a feature of a shared tool that you end up needing.

> But what if people expect us to make guarantees?

Use an open source license! For example, the [MIT license](https://opensource.org/licenses/MIT) clearly states, 'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED...' The open source world has got these things figured out already. Where have you been?

Wait. If everyone is using the same tool, doesn't that mean there are more people who can fix bugs? If someone wants a feature, doesn't that mean there are more people who can work on the feature? You mean, someone else has already laid out the foundation for a project and all you have to do is add this one small feature that you need and not spend weeks building the same thing from scratch?

_(insert mind blown gif)_

Yes! Yes! Yes! Share your code with other teams on campus and release it as [inner source](https://en.wikipedia.org/wiki/Inner_source). Start a culture on your campus of sharing your code with other teams! Once you're comfortable with that, start sharing with _other_ campuses! That's when you're ready for the big boy world of open source.

## But Law is Scary!

Clearly, you have not seen the thousands of popular open source projects started by random users with absolutely no legal experience. I'm recommending you use an open source license because it's quick and easy. As I said, the open source world has got it figured out.

I'm not a lawyer. What do I know? Allow me to point you to [Ben Balter's amazing post about open source licensing](https://ben.balter.com/2017/11/28/everything-an-open-source-maintainer-might-need-to-know-about-open-source-licensing/). If the average high schooler can create something on GitHub and open source it, I'm sure you can too. Developers should be focusing their time on developing _new_ things, not worry about licensing, or reinventing the wheel.

Encourage developers to share. We love creating stuff but not stuff that's already been invented. Remember college employees, students are the reason you still have jobs; you should be building things for them in the most efficient way possible.
