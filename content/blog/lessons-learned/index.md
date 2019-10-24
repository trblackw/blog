---
title: 6 Tips To Help Junior Developers Write Better Code
date: "2019-10-01T00:00:00+0000"
description: "Lessons I've learned, often the hard way, in my first year as a professional developer"
---
[buckle_up]: ./buckle_up.png

I began my journey into programming on February 10th of 2018 (yes I remember the day) as a last-ditch effort to figure out what to do with my life. I was about to go into the second semester of my senior year at NC State University, majoring in a non-tech bachelor of arts degree that I knew wasn’t going to get me very far. 

In search of my next move after college, I stumbled across various ads for “coding bootcamps”. These programs are essentially expedited curriculums (with varying efficacy) designed to take you from zero to job-ready in the software development field in 8-12 weeks. I quickly decided that this was to be my next route in life and began preparing to attend a bootcamp after graduation in December--I was close enough after all. 

Little did I know, I wouldn’t be just a student, but a teaching assistant as well. And soon after that, within less than a year of self-study, I’d have my first job as a professional web developer. 

As a recent exercise, I decided to sit down and write out all of the most valuable lessons I’ve learned in the school of software hard-knocks and felt as though, at the end of it, they could be of use to other engineers.

![buckle_up][buckle_up]

## Readability > concision

You learn very quickly when working with a team of developers that no matter how slick your one-liner function is, its terseness is a major barrier to its readability. I often centered my approaches to solving problems around writing as little code as possible--the fewer lines the better! However, the majority of our time as developers is spent reading instead of writing code, and readable code is often more approachable and easier to debug.

Keep in mind that favoring readability isn’t just going to help your fellow team members, but also your future self! This is still something that I have to remind myself multiple times a day. When I write code now, I try to frame it from the perspective of one of my team members.

## Cleverness killed the developer(s)

Or rather, it killed the developers who inherited their code. Being clever is what led many of us to get into software development in the first place and is considered virtuous in an individual. Architecture and systems, however, should not be clever. They should be as transparent and clear-cut as possible.

You can think of clever, in this case, as a synonym for “abstraction” or perhaps an antonym to “simplicity”. Cleverness often correlates with making long-term maintainability of codebases more difficult because the clever developer(s) hold(s) the keys to the castle, so to speak. In other words, they might understand the hidden complexities associated with a system or pattern that are inherently difficult for others to grasp.

## Magic tools come with a price

It’s definitely nice when a tool or library makes our lives as developers easier, but I’ve learned that the more “magical” these solutions seem, the harder they are to customize. Project needs and requirements are rarely static, so the plug-and-play tools that seem to “just work” without a clear understanding of the underlying mechanics will pose serious hurdles to debugging issues down the road. 

There’s a happy medium here, of course. You don’t need to roll your own solution to a problem every time, just make sure you have a relatively decent understanding of what’s going on under the hood of whatever published tool you decide to use.

## Choose the right tool for the job

It’s not always the case that you have decision-making power when it comes to the tools used to solve a given problem, but when you do, objectivity is key. Your favorite, shiny hammer isn’t always going to be the most appropriate or effective solution. Being able to ignore your biases towards technologies you favor can be a difficult lesson to learn, but a valuable one nonetheless. 

I’m fortunate enough to be at a company where this approach is employed for every project we take on. It’s a mindset rooted in experience and foresight and one that I’m grateful as a junior developer to be experiencing so early on in my career.

## Apply Occam’s razor to all parts of your code

The simplest solution is almost always the best one. I have to remind myself of this daily when I’m two hours deep into over-engineering a piece of functionality. “Should it really be this complicated?” I ask myself. Then, after taking a step back, the complexity often diminishes. This principle technically overlaps with all others in this list, but I think simplicity-focused code warrants its own discussion. 

I find that it helps to talk through problems out loud to arrive at these types of solutions, whether it be with a colleague or even to yourself (if it’s the latter I’d suggest doing it where no one else can hear you!). Don’t get too caught up on this minimalist approach though. As developers, we know that writing code is an iterative process and rarely is our final solution achieved on the first try. Make it work, then simplify it as best you can.

## Use your chain-of-command when asking questions

One of my greatest strengths and flaws as both a developer and a person is that I’m very quick to ask questions--too quick in most cases. Clarity, I need it and I need it now! The unfortunate reality is that there are, in fact, stupid questions (at least amongst a team of developers).

My time in the Air Force Reserves has informed me of a chain-of-command protocol when seeking resources--I think there’s a lot of parallels with a development shop. Of course, a lot of things are different as well! The goal of this system is to solve your issue as low on the chain as you can, and to be the least disruptive. 

If you’re a frontend engineer with questions about an in-house API you’re consuming, ideally your backend team has documentation--read it! If you run into a bug, do everything you can to reproduce it and narrow down its causes because, frankly, time is money. If you jump to shoot a message to a team member asking why x-y-x bug is occurring, not only do you risk breaking their focus for their own tasks, you also risk wasting time altogether if the issue is trivial or could be easily understood if you spent a little more time to understand it.

On the flip side, I’m a firm believer of there being an “uncle point” when tackling a problem. In other words, a point in which you’ve spent enough time on the issue at hand and haven’t made any progress. Being able to ask for help is a major strength and an integral part of being an effective developer, I would just urge you to be diligent in the questions you ask and ensure they aren’t ones you could answer for yourself.

---------------------------------------------------------------------------

I’ve learned an immeasurable amount at my time at CrossComm and worked with some exceptional people who I find to be incredible engineers and human-beings. This list could quite honestly go on much further, but I feel as though the rest of my points could be summed up in a closing sentiment.

Being an effective engineer requires you to be honest, both with yourself and with your teammates. There are simply too many things for one person to know when developing excellent software. Find strength in your teams’ cohesiveness and variance in skill sets (ideally there are some) and try to narrow your focus as best you can, especially as a junior. The same applies if you’re a freelancer, minus the team aspect of course, but hopefully the work you take on is to scale! 

I have so much more to learn about the software development field, I realize. I am very far from expert, but I couldn’t be more excited about the road ahead, particularly as being a part of the CrossComm team. After so many years of searching, I’ve found the field in which I belong.

Thanks for listening 👋🏻
