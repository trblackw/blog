---
title: Use Immer.js to Manage Your Immutable React State
date: "2020-5-30"
description: "Pass the reigns to Immer when it comes to maintaining immutability when working with your app state"
---
[immer-logo]: ./immer_logo.png
![immer-logo][immer-logo] 

If you've worked with React, or frankly any JavaScript framework, you've probably come across the
idea of keeping state "immutable". In other words, when working with state, you want to avoid
mutating the state object when updating a particular value. Immutability is a core concept of both
object-oriented and functional programming, so before I dive into the awesomeness of Immer, I just
want to take a brief moment to expound upon what it is and why it's important in the applications we build.

## What is "immutability"?
The root of what it means to be immutable, regardless of programmatic context, is to be unchangeable. Basically,
what's done is done, there's no changing it. Where the textbook definition and programmatic definition differ 
is that it isn't a matter of _can_ you, rather, _should_ you?

Because my knowledge of programming is very much limited to the web domain, any further discussion of immutable
programming practices will be framed in the context of JavaScript.

I think a common misconception of what mutating something in JS is, is reassigning an already declared variable.
For example:
```javascript
let name = "Bob";
let age = 24;
name = age; //hey you mutated the name variable!
```
However, this is incorrect because mutability deals strictly with the `object` primitive type, and therefore reassigning
`name` to `age` is not a mutation. As a side note, if this is a behavior you'd like to prevent, either consider using
TypeScript, assigning `name` as `const`, or both (my preference). 

## React promotes immutable state interactions
If you've worked with React at all, you likely already know that the framework is an advocate for and adopter of immutability.
The [documentation](https://reactjs.org/docs/update.html) discusses this further, but I can give you the TL;DR. The ultimate goal
of a JS framework like React is to be "reactive". In other words, when a JavaScript value changes, react to it! This can be
changing a button color, a numerical value, or perhaps an item within a list of items. Let's take this state structure as an example:
```javascript
state = {
  name: 'Bob',
  age: 24,
  hobbies: ['swimming', 'hiking'],
  background: {
    jobs: ['mechanic', 'bank teller']
  }
}
```
If you wanted to add a hobby for Bob, given this structure, you could just push to his `hobbies` array:
```javascript
state.hobbies.push('reading')
```
The downside to this approach, however, is that you have no way of knowing which _specific_ properties have changed in that state object
since the previous copy of that object was overwritten. This is what happens when you drill down into an object to update a property
without caring about other properties of that object.

The modern hooks era has certainly changed the way we handle state in our React apps, most notably, we no longer have to store all of our
component's state in a giant object. The `useState` hook allows us to itemize our state objects within a given component. If you're like me,
I'm very keen on grouping related component state together within a `useState` hook. In other words, I often use `useState` hooks to deal with
objects rather than singular values.

Here's a look at one of my most common approaches to updating state for a given state object defined within a `useState` hook:
```javascript
const initialFormState = {
  email: '',
  password: '',
  valid: false
}

function Form() {
  const [form, setForm] = useState(initialFormState);
}
```
And any time I update a value in that state object, I'd have to be sure not to mutate the object as a whole. For example, if I wanted to set the
`password` property without affecting the other state properties, I'd do something like this:
```javascript
setState(prevState => ({ ...prevState, password: 'password'}))
```
The initial argument provided to the second of two values returned from `useState` is the previous state based on the value(s) passed as argument(s).
This isn't that bad, right? Pretty clean cut, fairly readable if you're familiar with arrow functions, implicit returns and object spreading, but this
is the simplest of cases.
