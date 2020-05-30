---
title: Implementing “Redux-style” state management with React’s useContext & useReducer Hooks
date: "2019-01-26"
description: A look into how to manage state in React using just the Context API while applying Redux principles
---
[hook_pirate]: ./hook_pirate.png
![Hook Pirate][hook_pirate]

For those that aren’t yet aware, the React team recently introduced Hooks as a way to take a more functional approach to writing components and they’ve been in v16.8.0-alpha.1 for the past few months. However, they’ve now been [officially approved](https://github.com/facebook/react/pull/14679) and will be included in the upcoming version of React 🎉

(If there were a video that you had to watch regarding Hooks, it’d be [this one](https://www.youtube.com/watch?v=dpw9EHDh2bM&feature=youtu.be))

There are a lot of opinions regarding how Hooks will impact the React ecosystem, particularly in regards to the way we manage state in our React applications. If you’ve got a pulse on recent activities in React, I’m sure you’ve come across a variant of articles titled *“Are Hooks a Redux killer???”* or something to that effect. My opinion, no.

Redux definitely has its learning curves and it can be difficult to grasp its awesomeness in small scale applications that don’t really require it. There’s a lot of boilerplate and what I’d like to call “ritualistic” code that you have to write to get everything set up with Redux, but once it’s configured properly it’s quite amazing. The tooling around Redux, particularly its [developer tools](https://www.npmjs.com/package/redux-devtools-extension), is also phenomenal and debugging your React application can be made much easier after Redux is implemented. However, for smaller applications that might not warrant Redux, alternative approaches (like what I’ll describe below), I’d say, can be used.

Through picking and pulling from various methods I’ve seen in tutorials and walkthroughs about Hooks, I’ve crafted a way to apply the style of state-management we see used in Redux but with *just* React. Full transparency, the applications in which I’m using this system are of relatively small scale and I think that larger applications with many developers could definitely stand to benefit a lot more from using Redux.

This system utilizes the [useContext](https://www.npmjs.com/package/redux-devtools-extension) and [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) Hooks. The former, as described in the React docs, 
>“Accepts a context object (the value returned from React.createContext) and returns the current context value, as given by the nearest context provider for the given context”

and the latter 

>“Accepts a reducer of type (state, action) => newState, and returns the current state paired with a dispatch method. (If you’re familiar with Redux, you already know how this works.).”

My file structure for these projects looks like this:

```javascript
> public
> src
 - components/
 - state/
   - actions/
   - reducers/
   - context/
   - constants.js
 - hooks/
```

In `context/index.js` I create an instance of context using React.createContext:

```jsx{numberLines: true}
import { createContext } from "react";
const UserContext = createContext({
  currentUser: localStorage.getItem("auth-user")
  ? JSON.parse(localStorage.getItem("auth-user"))
  : {}
 });
export default UserContext;
```

Then, in `App.js` I define my `initialState`, storing in it the returned value of the useContext hook:

```jsx{numberLines: true}
const App = () => {
   const initialState = useContext(UserContext);
   const [{ currentUser }, dispatch] = useReducer(
   UserReducer,
   initialState
   );
   return (
      <UserContext.Provider value={{ currentUser, dispatch }}>
      <Nav />
      <Router>
          <Login path="/" />
          <Register path="/register" />
          <Dashboard path="/user/:id" />
      </Router>
      </UserContext.Provider>
)};
```

Notice at the top of my App component, I deconstruct the currentUser from the state that is deconstructed from the returned value of useReducer (*~deconstruction inception~*). I then pass the currentUser and the dispatch function received from useReducer (which we’ll get to in a minute) to the context provider, making it available to each component in my app. For anyone not familiar with deconstructing, the same can be accomplished via:

```jsx{numberLines: true}
const [state, dispatch] = useReducer(UserReducer, initialState)
...
<UserContext.Provider value={{ currentUser: state.currentUser, dispatch }}
```

Now let’s take a look at my reducer in `reducer/index.js`:

```jsx{numberLines: true}
import { REGISTER_USER, LOGIN_USER, LOGOUT_USER } from "./constants";
const initialState = {
  currentUser: localStorage.getItem("auth-user")
  ? JSON.parse(localStorage.getItem("auth-user"))
  : {},
  errorMessage: ""
};
const UserReducer = (state = initialState,
{ type, registeredUser, loggedInUser, success, message, boards }
) => {
switch (type) {
  case REGISTER_USER:
    console.log(
     `%c {type: REGISTER_USER, registeredUser: ${JSON.stringify(
       registeredUser )}}`, "color: yellow; font-weight: bold");
return success ? { ...state, newUser: true }
 : { ...state, errorMessage: message };
  
  case LOGIN_USER:
    console.log(`%c {type: LOGIN_USER, loggedInUser:
      ${JSON.stringify(loggedInUser)}}`, "color: teal; font-weight:
       bold");
 return success ? { ...state, currentUser: loggedInUser }
  : { ...state, errorMessage: message } 
case LOGOUT_USER:
  console.log(
    `%c {type: LOGOUT_USER, currentUser: {}} `,
      "color: pink; font-weight: bold" );
return { ...state, currentUser: {} };
default:
  return state;
}
};
export default UserReducer;
```

A couple of things to note… First, why did I repeat code when defining my initialState at the top of the file? Why couldn’t I have just assigned initialState the returned value of `useContext(UserContext)` like I did previously, or why couldn’t I have just defined it elsewhere, exported it and then imported it into my reducer file? An important caveat when it comes to calling Hooks (from the React docs): 
>“**Don’t call Hooks inside loops, conditions, or nested functions**. Instead, always use Hooks at the top level of your React function. By following this rule, you ensure that Hooks are called in the same order each time a component renders. That’s what allows React to correctly preserve the state of Hooks between multiple useState and useEffect calls.” 

In other words, you can only call a Hook at the top level of a React function, not a regular JavaScript function.

Also, what the heck is this console.log business? Well, if you’ve ever used the [redux-logger](https://www.npmjs.com/package/redux-logger) middleware, this is my cheap attempt at mimicking that functionality and letting me know when each reducer is being called.

If you haven’t been able to tell already, I’m a huge fan of deconstruction and have deconstructed my “payload” (if you’re familiar with Redux) in the parameters of my reducer function. Notice, however, that overall, this follows a very similar structure as a Redux reducer — mainly because it’s just plain JavaScript.

Here’s one of my actions in `actions/index.js`:

```javascript{numberLines: true}
export const registerUser = async (user, dispatch) => {
  const { username, email, password } = user;
try {
 const registerRes = await fetch("/user/register", { method: "POST",
  mode: "cors", cache: "no-cache", headers: { "Content-Type":
  "application/json"
 },
 redirect: "follow", referrer: "no-referrer", body: JSON.stringify({
   username, email, password })
 });
const { token, success, user: registeredUser } = await 
 registerRes.json();
if (success) {
  dispatch({ type: REGISTER_USER, registeredUser, success });
   console.log(`${user.username}'s account was REGISTERED and set in 
   localstorage`);
return localStorage.setItem( "auth-user", JSON.stringify({
  token, username: registeredUser.username, id: registeredUser._id
 })
);
}
} catch (error) {
  console.error(error);
  return dispatch({ type: ERROR, message: error.message });
 }
};
```

If you’ve ever used [redux-thunks](https://www.npmjs.com/package/redux-thunk), that’s essentially the form of each of my action creators. Notice how I’m accepting the dispatch function as an argument, which is passed to the action from the component in which it’s called.

So, how the heck do you actually make use of all this? Well, here’s how I use it in my `components/Register.js` (making use of the action creator defined above):

```javascript{numberLines: true}
import React, { useState } from "react";
import { navigate } from "@reach/router";
import { registerUser } from "../state/actions/user_actions";
import { useContext } from "react";
import UserContext from "../state/context";
const initialFormState = {
  username: "",
  email: "",
  password: "",
  organization: ""
};
const Register = () => {
  const [user, setUser] = useState(initialRegisterFormState);
  const { dispatch } = useContext(UserContext);
  const handleInput = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    setUser(initialFormState);
    registerUser(user, dispatch);
    navigate("/");
 };
...
```

I’m able to deconstruct my dispatch function from the returned value of the useContext Hook, which I’m then able to pass to my registerUser action. Easy peasy. Notice how I’m also making use of the useState Hook to manage the component’s local state.

And that’s about it! No other dependencies needed other than React. As a reminder, this is a system that I’ve been playing with and I, myself, am still learning how to use Hooks, especially when it comes to managing state. As I mentioned before, when it comes to large scale applications, I’d say that Redux will probably be a better option, but I encourage you to explore the world of Hooks and how they can allow you a variety of ways to manage your application’s state!

Thanks for listening 👋🏻
