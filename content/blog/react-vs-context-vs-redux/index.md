---
title: You probably don't need Redux...or Context!
date: "2019-12-11"
description: A simple reminder that React, itself, is a state manager
---
[bobby]: ./bobby.jpg

## A homage to the simplicity of React's internal state

I've been writing React for nearly two years now and it has been without a doubt my favorite tool to work with in the web development space. Much like the software industry as a whole, React is constantly evolving, particularly when it comes to the way it manages state. As of version 16.8, React has rolled out with a new [hooks API](https://reactjs.org/docs/hooks-intro.html) that, for all intents and purposes, has flipped the ecosystem on its head. 

My present goal is not to focus on these API changes specifically, rather, their impact on the way we manage React state in our apps. One of the best things about React, in my opinion, is how unopinionated it is when it comes to configuration, tooling and implementation.  However, third party libraries are often the de facto when it comes to app-wide state management, with React itself being deemed as inferior to handling large scale immutable state objects. I hope to build an argument against this mindset being the default when starting from step one with a React app. Of course, I acknowledge that there are definitely going to be scenarios, often associated with scale, where these external tools make our lives as developers easier. This is not a blog post framed around dissuading you from ever using Redux--I personally really enjoy using it and find it to be incredibly powerful given the right circumstances. However, your Todo app or personal site definitely does not need Redux nor the more recently popular variant of state management with [React Context](https://reactjs.org/docs/context.html#contextprovider). By the end of this post, hopefully I'll at the very least make you think twice before reaching for such tools in your next React project.

So let's get into it.

>Disclaimer: all implementations of React, regardless of state management method, will include purely hook implementations. If you aren't familiar with hooks, I'd suggest checking out the initial link above before continuing


## Prop drilling...ugh

The most common reason that I see React developers use a third party library like Redux or perhaps a custom implementation of Context is to avoid prop drilling. Prop drilling occurs when a child component requires a specific piece of state, but the parent that houses that state is several levels higher in the component tree. The intermediary components, of course, do not care about such state, so solutions like Redux and Context (I'm aware there's half a dozen others but I'll only speak to those with which I have experience) aim to essentially cut out the middleman. 

Here's a common example of a basic Redux set up to avoid prop drilling (keep in mind that this is a tiny example, so the _drilling_ will be fairly shallow):

<iframe src="https://stackblitz.com/edit/redux-avoid-prop-drilling?embed=1&file=index.js&hideExplorer=1&view=editor" width="600" height="400"></iframe>

The Redux store, in this case, consists of a `search` string, an array of `episodes` (thanks to the lovely [Rick and Morty API](https://rickandmortyapi.com/)) and an `error` object. The first question I'd urge you to think about is why any of these things need to be in the store, or in other words, global state. Particularly something as ephemeral as a search string. 

And here's a comparable version using React Context:

<iframe src="https://stackblitz.com/edit/context-avoid-prop-drilling?embed=1&file=index.js&hideExplorer=1&view=editor" width="600" height="400"></iframe>

Both of these approaches solve the issue of prop-drilling, but I'd urge you to consider the problems or bugs they might introduce over the lifespan of the app. I acknowledge that this isn't really an _app_ considering it's fetching an end point and rendering some strings, but I think this is how most apps start out, right, especially our side projects. We don't anticipate all the things we'll want to do, the features we'll want to add and whether or not such features will benefit from such a rigid system.

And one step further, how does our app, albeit rudimentary in the case of the above sandboxes, benefit from having the `episodes` be in global state? This creates a slippery slope in the sense that by storing the episodes in this way, as frontend engineers, we're essentially creating a client-side database with which we must constantly compare our actual database (given there is one of course). We lose our single source of truth merely to avoid an extra request (or two). What is the purpose of this? Some might argue that it allows for easier filtering or querying of client side data to avoid "unnecessary" backend requests, but I'd argue the convenience benefits you perceive on the frontend are meaningless when compared to the potential bugs related to data stagnation that will likely occur between the front and backend of your app. 

Side note, some people might be thinking that if they don't have a backend that this might not apply to them, but I'd push those people to go one step further and ask why, if they're that small, to even have an external state-manager at all.

## Error Handling

A common mindset associated with using a state management tool like Redux or Context is that it's all or nothing. In other words, if you're going to use it, use it for **everything**. I, too, used to think this way. However, I've since changed my tune and now approach Redux with the opposite mindset. Now, I firmly believe that you should only add something to your store when you absolutely must. I'd feel confident in saying that this is much less often than you'd think as well, particularly when it comes to handling errors in your application.

Notice how in each of the above approaches, I'm incorporating an error state in my global store. This is a common practice I've seen with Redux and other state management systems, the goal presumably being to tailor a given error message in a way that gives it context (not related to React Context of course) to a particular view. This introduces quite a cumbersome paradigm though because every time we set our error state, we subsequently have to clear it. I've ran into this headache time and time again in massive Redux codebases where nearly every action you create as a developer has to have an inverse action to clear the state produced--because it's **ephemeral**. 

>Use React for ephemeral state that doesn't matter to the app globally and doesn't mutate in complex ways. - Dan Abramov in a Redux Github issue

I can almost guarantee you that more of your application consists of ephemeral state than you'd think.

## Ecosytem Pressures

As React developers, there are tons of preachy opinions that constantly overshadow the work we do and how we architect applications, and there's been many a time where I've incorporated Redux merely because it was a popular tool and I could add it to my resume. But, what I didn't stop to think about was whether or not it actually added benefit to what I was building.

Right now, if you google "React state management", your results are going to be across the board. "Context makes Redux obsolete!!!", "MobX provides groundbreaking new observer paradigm for state management", "New Redux hooks API brings a total revamp to React state management!" (all of these are made up titles). When I mentioned earlier that one of my favorite parts about React is that it's unopinionated, that certainly does not apply to the React ecosystem and it's one of the more frustrating pain-points of being a React dev in late 2019.

If there's any point that I could get across, it would be that if learning React were a linear path, it should take _roughly_ this form:

1) **Learn JavaScript**
2) **No really, I mean learn JavaScript**
3) **Learn React**
4) **Build projects with React** (no external state managers)
5) **Learn Redux or another third party state manager once you've experienced pain points of not having global state**

More often than not, I'm afraid the path is 25% of 1 then 3, then 5.

![bobby][bobby]

👆🏼Devs who have spent 5 minutes w/ JS & 30 minutes w/ React trying to learn Redux

To reiterate, I **am not** saying that you shouldn't learn Redux, or even that your application doesn't need Redux. Redux is exceptional in environments that require it, I'm just encouraging you, as a developer, to think about what it is that you're building and if it would actually be enhanced by bringing in an external tool like Redux or rolling your own custom state manager (danger ⚠️) with Context. 

Context specifically is a currently trending solution for managing React state, and I, myself, was a passenger on the hype train for some time, but then I incorporated this system in a couple production applications. An analogy I think fits when discussing the controversial Redux vs Context debate is likening Redux to a luxury Mercedes and Context to a 1975 Ford Pinto. Both approaches will get you to where you need to go, it's just a matter of how safe you want, or need to be, to get there.

There seems to be an argument for (or against?) Context revolving around the fact that Redux uses React.Context under the hood. However, the Context API itself wasn't constructed with state-management in mind, rather just as a solution for making a value or values available from one component to another deeper down in the component tree. Regardless of the intent of such a stance, Redux has numerous built in performance enhancers, render bailouts, etc that Context, alone, does not have. Playing off the above car analogy, converting a code base from Redux to purely Context is effectively ripping out the air bags and seat belts from your car. Yeah it's still drive-able, but it's a lot less safe.

## Oh hey, React

Let's revisit the previous two setups using Redux and Context with a similar example using just React:

<iframe src="https://stackblitz.com/edit/react-avoid-prop-drilling?embed=1&file=index.js&hideExplorer=1&view=editor" width="600" height="400"></iframe>

You should notice a couple differences here. For one, the code is just generally lighter, we've also dropped our `reducer`. Also,the `Search` component no longer manages its own state--it receives its state, and state setter, from its parent `Content` component. This is commonly referred to as "Lifting State Up". Also, because of this parent-child restructure, we get an added benefit of real time search filtering for free. By that I mean that, in the above sandbox, if you search for an episode you're able to instantly see results based on your search rather than having it be based on you clicking the search button.

Seems nice, right? How much did we even have to change to get here? All we did was remove any boilerplate associated with the previous Redux or Context examples and pass some props from a parent to a child. Notice how, in this scenario, the parent-child prop relationship transpired in a very desirable way. Our parent, `Content` component manages all the necessary state for our app. Again, I'll address the fact that this is a very simple app that doesn't really resemble that which we are typically dealing with when making these architectural decisions around state management, but I'd implore you to consider scaling this approach to whatever your problem may be. To elaborate, I mean that just because there are several components that might care about a specific piece of state **does not** mean that that piece of state needs to be global. The way in which you compose your components can easily remedy this ailment that you might ascribe to prop drilling.

I'd even go one step further and suggest that Redux _can_ make us lazy as React developers. When any piece of state can be connected with any component, regardless of its position in the component tree, cohesive component composition is often an afterthought.

Michael Jackson, co-founder of [React Training](https://reacttraining.com/) and co-creator of [React-Router](https://egghead.io/podcasts/react-router-with-michael-jackson) recently published an excellent, [short video](https://www.youtube.com/watch?v=3XaXKiXtNjw&feature=youtu.be) on the power of component composition that I will not attempt to replicate here, but I encourage you to check it out because it is an exceptional remedy to most of the hardships we experience as React devs when passing props and attempting to manage global state.

## Go forth & create w/ an open mind!

I've dabbled in several different technologies in my development career, but few get me as excited as React. Now, more than ever, is an excellent time to be a React developer as the lines between front end and full stack are increasingly blurred, which could honestly warrant a blog post of its own. React [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html) and [Concurrent](https://reactjs.org/docs/concurrent-mode-reference.html) mode are two other groundbreaking APIs that the team will likely be publishing early next year, adding core functionalities like code splitting and non-blocking rendering that will radically change how React works and significantly enhance both developer and user experiences.

Just because that open source project that got a lot of upvotes on Reddit is using TypeScript, Redux, GraphQL, Apollo Client, etc does not mean that you have to. **Pre-optimization is the root of all evil**. Start simple and add tooling as complexity requires it. React's internal state is perfectly capable of handling most of your run-of-the-mill apps, especially pet projects that are just starting out (and often end up collecting dust in your repo collection). z

Redux can be an incredible tool to add to your React toolkit, I just encourage you to be more mindful of when and how to use it. 

Thanks for listening 👋🏻
