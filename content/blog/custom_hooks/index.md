---
title: Two simple, reusable Hooks for your React Apps
date: 2019-01-28T00:00:00+0000
description: One of my favorite things to do in React lately is build custom hooks. Here's two that I use a lot!
---

React’s new Hooks API provides a host of awesome tools for you to utilize in creating and managing your applications. The hook functions included are useState for managing local state in your components, useEffect for creating various life-cycle methods as well as fetching data from an external API, and useContext which allows each of your components to consume an instance of your app’s context. In addition, React allows you to create your own custom Hooks that enable you to extract a component’s logic (stateful or not)into externalized reusable functions.

According to the React docs,

> "A custom Hook is a JavaScript function whose name starts with ‘use’ and that may call other Hooks."

This naming convention is suggested in order to follow the pattern that’s already in place. This is similar to the React team's recommendation of defining your state by prefacing the state setter with 'set', via useState, i.e.:

```jsx
const [stateItem, setStateItem] = useState(initialValue)
```

My favorite part about writing your own custom Hooks is that they’re not only reusable throughout an application in which they’re defined, but also throughout all of your applications. This can be said for the two Hooks I’m about to describe. So let’s get to it.

## useInputValue

```jsx{lineNumbers: true}
import { useState } from "react";export const useInputValue = initialValue => {
  const [value, setValue] = useState(initialValue);
   return {
     value,
     onChange: e => {
      setValue(e.target.value || e.target.innerText);
    };
  };
};
```

Notice how we don’t even need React here because we aren’t returning/rendering any JSX, this is merely a JavaScript function. The useInputValue function simply takes in an initial value, sets it as the value for the value variable received from useState and it returns an object containing the value and an onChange function to update that value. I know it can look a bit weird, but it makes handing inputs in your components a lot more concise. Let’s look at an example of how to use it:

```jsx{lineNumbers: true}
import React from "react";
import { Link } from "react-router-dom";
import { useInputValue } from "./hooks/useInputValue";
import { loginUser } from "../api/user";

const Landing = () => {
const email = useInputValue("");
const password = useInputValue("");
const handleSubmit = e => {
  e.preventDefault();
  loginUser(email.value, password.value);
};
...
<input type="text" placeholder="Email" {...email} />
<input type="password" placeholder="Password" {...password} />
...
```

The syntax can initially be off-putting, but if you’re familiar with [object spreading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) this is actually quite cool. If you recall, we’re returning an object from our custom Hook, so email looks like this `{ value, onChange: () => ...}`. This means that by spreading over both the email and password variables on our inputs, we’re exposing the onChange handler to the input and thus this is all we need to update the inputs’ values. You can imagine that this hook could be quite powerful if you wanted to add further validation logic and other event listeners. Keep in mind that if we were to name our updater function anything other than onChange or any other event listener in React, the spread syntax wouldn’t work.

A personal recommendation though when it comes to using a hook like this is to do so for smaller forms, ideally where there's only a couple of input field (i.e. a login form). If nothing else just to avoid the clutter of having 7 different invocations of the hook at once, given there were 7 form fields. I prefer to work with objects in these cases, but of course that's a matter of preference.

## useToggle

This one is probably my favorite and I use it fairly often in projects I work on. It’s also super concise and fairly readable:

```jsx{lineNumbers: true}
import { useState, useCallback } from "react"

export const useToggle = initial => {
  const [open, setOpen] = useState(initial)
  return [open, useCallback(() => setOpen(status => !status), [open])]
}
```

Notice how I’m making use of the [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback) Hook that React provides. This Hook does exactly what you think it would do, allowing you to, according to the React docs,

> “return a memoized version of the callback that only changes if one of the inputs has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.”

Say what?? “Memoization” is a topic in itself and one that I won’t get into here, but if you’d like to learn more about it, check out this article. Here’s how I interpret the doc’s explanation: Whenever we utilize the useCallback Hook, it’s smart enough to know whether or not the component needs to be re-rendered (that “reference equality” bit) or if the toggling functionality needs to occur. In order to implement this toggling functionality, once again we have a function that takes in an initial value and stores it in the state (open) received from useState. It then returns an array with that state as well as a callback to toggle the a container’s open status. And that’s that.

So, here’s an example of how I use this Hook to toggle the view-ability of search filters (note that I’m using [styled-components](https://www.npmjs.com/package/styled-components)):

```jsx{lineNumbers: true}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToggle } from "../hooks/useToggle";
import {  LandingContainer,  FlexContainer,  Button} from "../styled_elements/layout";
import Filters from "./Filters";
import { fetchProducts } from "../actions/index";
import { Pages } from "../styled_elements/layout";
import ProductList from "./ProductList";

const Landing = ({ products, total, pages }) => {
  const [open, toggle] = useToggle(false);
  const [activePage, setActivePage] = useState(1);

 useEffect(() => {
  fetchProducts(activePage);
 },
  [activePage]
 );

 const handlePageClick = page => setActivePage(page);

return (
  <>
{open && <Filters />}
<LandingContainer>
  <div>
    <Pages>{generatePages()}</Pages>
  </div>
  <FlexContainer>
    <Button onClick={toggle}>Refine search</Button>
    <Link to="/reviews"><Button>View reviews</Button></Link
  </FlexContainer>
  </>
)
```
Notice the conditional rendering of the `<Filters />` component and the toggle function being passed to the “Refine search” button. This is just one of many different ways to utilize this Hook and it truly works for anything you’d like to toggle.

Well that’s all I’ve got. I hope you’re able to find some use out of these, or if you’ve got any tips for refinement or perhaps some Hooks of your own I’d love to hear them.

Well that’s all I’ve got. I hope you’re able to find some use out of these, or if you’ve got any tips for refinement or perhaps some Hooks of your own I’d love to hear them.

Before I go, [useHooks.com](https://usehooks.com/) is an awesome subscription-based site that provides TONS of custom Hooks written for everything you can imagine. I’d definitely recommend checking it out if you’re wanting to learn more about React Hooks.

Thanks for listening 👋🏻