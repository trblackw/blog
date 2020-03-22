---
title: Managing Google Cloud's Firestore with React Context
date: 2020-03-20T00:00:00+0000
description: Define and share your app's Firestore instance using React Context and TypeScript
---

[firestore-react]: ./firestore_react.png
![firestore-react][firestore-react]

# Cloud Firestore

Google's [Cloud Firestore](https://cloud.google.com/firestore) is a NoSQL, serverless database solution that has become increasingly popular for storing, syncing and querying data for your app.
Google provides both a Node.js and client-side JavaScript SDKs for data integration that make it very easy to work with and manage your database. I'd like to talk about a way to use the power of
Firestore in your React app through the use of React's [Context API](https://reactjs.org/docs/context.html).

I don't intend to dive too deep into Context, specifically, rather why it can be useful for instantiating and sharing your app's Firestore instance. **As a disclaimer**, I do not mean to suggest this
is the only, or even the "correct" way to utilize Cloud Firestore in React, I just want to share a system that's been working nicely for me in my latest production application. I will also not go
too in-depth with Firestore's database architecture either; my goal is merely to show you how to get it set up with Context.

## Set up Firestore app

To get started, you'll need to go to Google's [Firebase website](https://firebase.google.com/) and sign up/log in so you're able to add a new project in the firebase console (web interface).
After that, go to your project's settings and select `Config` in the radio button selections under "Firebase SDK snippet". It should look something like this:

```javascript
const firebaseConfig = {
  apiKey: "xxxxxxxxxx",
  authDomain: "xxxxxxxxxx",
  databaseURL: "xxxxxxxxxx",
  projectId: "xxxxxxxxxx",
  storageBucket: "xxxxxxxxxx",
  messagingSenderId: "xxxxxxxxxx",
  appId: "xxxxxxxxxx",
  measurementId: "xxxxxxxxxx",
}
```

You'll need to include this config when you instantiate your Firestore. There's a couple of ways this config can be stored/used in your client-side code, just be sure to add it to your `.gitignore`.

There are also several packages you'll have to install before you're able to successfully initialize and connect to your database (not to mention the base React dependencies). These include `firebase` for hooking
into the firebase core functionality and `firebase-tools`, which will allow you to use the [firebase CLI](https://firebase.google.com/docs/cli). Optionally, you can also install `@firebase/firestore-types`.
I've found that it has some type definitions that are missing from the `firebase` core.

## Instantiate Firestore

Once you've got your config handy and the necessary packages installed, you're now ready to instantiate your Firestore 🔥. Here's how I did it. In my root `index.tsx` file, where my React app is rendered, I
define and export my firestore app. There isn't any particular reason this has to be done here, I just thought it made sense to be at the root level:

```jsx
import React from "react"
import { render } from "react-dom"
import "styles/index.css"
import App from "App"
import { firebaseConfig } from "config/firebaseConfig"
import { initializeApp } from "firebase/app"

export default initializeApp(firebaseConfig)

render(<App />, document.getElementById("app"))
```

Note that I'm importing my project's config and passing it to Firebase's `initializeApp` function. What's returned from this will be the Firestore app, but I don't need access to it in this file so I immediately export it.
Pretty straightforward, but I still need to do a few more things before I'm cooking with gas. I want to be able to:

1. abstract/organize the CRUD logic for each of my [Firestore collections](https://firebase.google.com/docs/firestore/data-model#collections)
2. login/have access to the current user
3. share my Firestore app with every piece of my React app that needs it through Context.

## Firestore CRUD abstraction

React hooks have made programming in React much more functional and declarative, which I really enjoy personally, but I feel that there's perks to using classes when it comes to working with Firestore collections.
I'll get into some examples momentarily, but inheritance helps to keep my CRUD logic DRY (**D**on't **R**epeat **Y**ourself) when it comes to defining common collection methods.

So I'll define a class for each one of my collections that will contain various methods for querying/writing/updating collections and the [documents](https://firebase.google.com/docs/firestore/data-model#documents) they contain.
If you've ever worked with MongoDB, this is a similar style that's used when interacting with your database using Mongoose. Before defining any collection classes though, I first want to define
a parent class from which all other collection classes will inherit:

```typescript
import firebase from 'firebase/app';
import FirebaseApp from '../index';
import { Firestore } from 'firebaseTypes';

export enum Collections {
  USERS = 'users'
}

export default class FirebaseModel {
  public store: Firestore;
    constructor(store: Firestore | null) {
      this.store = store ?? FirebaseApp.firestore();
   }

  public static get userCollection() {
    return Collections.USERS
  }
}
```

Couple of things to address here. Upon invoking the `FirebaseModel` class, I'll pass a (nullable) `store` argument that will represent the Firestore app. If the store
is already defined then I'm just going to use the pre-defined Firestore, otherwise my React app hasn't mounted yet and I need to instantiate it by calling the `firestore`
method on my `FirebaseApp`. As a reminder, the `FirebaseApp` is the return value of `initializeApp(firebaseConfig)`.

Now I'll define a collection class for `users` that inherits from the `FirebaseModel` class, as well as a `getAllUsers` and a `getCurrentUser` method. Our `currentUser`
will be defined in an upcoming step:

```typescript
import { FirebaseModel } from "../firebaseTypes"
import { User } from "./userTypes"

export default class UserModel extends FirebaseModel {
  public async getCurrentUser(userId: string): Promise<User> {
    const currentUser = await this.store
      .collection(UserModel.userCollection)
      .doc(userId)
      .get()
    return { ...currentUser.data(), id: currentUser.id } as User
  }

  public async getAllUsers(): Promise<User[]> {
    const userCollection = await this.store.collection(UserModel.userCollection).get()
    return userCollection.map(user => ({
      ...user.data(),
      id: user.id,
    })) as User[]
  }
}
```

I'll get into some examples of how this `UserModel` is used shortly, but the defined methods are pretty basic top-level collection queries. A quirk of querying Firestore, of which there are several,
is that the documents that are returned essentially have to be "unzipped" before their properties are accessible, which is achieved by calling the documents `data` method. Also, if
you want access to the document's `id`, you have to manually add it to the return object 🤷🏻‍♂️.

## Firebase Admin for Authentication

Using Firestore makes authenticating users very easy. I've defined an `AuthManager` class to manage methods associated with user authentication:

```typescript
import FirebaseApp from "./index"

class AuthManager {
  async login({ email, password }: { email: string; password: string }) {
    await FirebaseApp.auth().signInWithEmailAndPassword(email, password)
  }

  async logout() {
    return FirebaseApp.auth().signOut()
  }
}

export default new AuthManager()
```

Once a user is successfully logged in, we'll be able to access their user object via `FirebaseApp.auth().currentUser`

## Defining the Firestore Context

As a quick preface to getting into React Context code, I'm a firm believer that Context is not intended to replace Redux as a global state manager--it is intended for
sharing **contextual** data that will not be updated often without having to drill props through multiple component levels. I'm not going to be updating my Firestore app directly, so,
to me, it passes the _is it contextual?_ test. I'll also include a `currentUser` in this Context, which, again, satisfies my definition of contextual.

Now I'm going to define my Firestore Context so I can pass the Firestore to components that need it. When defining instances of Context, I prefer to create wrapper React components that
render children that have access to it, as opposed to exporting the return value of `React.createContext` and wrapping various parts of my app in a [Context Provider](https://reactjs.org/docs/context.html#contextprovider).
I think it's a nice way to contain any specific update logic for distinct pieces of Context.

```jsx
import React, { createContext, ReactNode, useEffect, useState } from "react"
import { User as FirebaseUser } from "firebase/app"
import { Firestore } from "firebaseTypes"
import FirebaseApp from "../index"
import { User } from "state/users/userTypes"
import UserModel from "state/users/userModel"

type FirestoreContextType = {
  firestore: Firestore | null
  currentUser: User | null
}

export const FirestoreContext = createContext<FirestoreContextType>({
  firestore: null,
  currentUser: null,
})

export default function FirestoreContextProvider({ children }: { children: ReactNode }) {
  const firestore = FirebaseApp.firestore()
  const [firebaseUserObject, setFirebaseUserObject] = useState<FirebaseUser | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const UserCollection = new UserModel(firestore)

  useEffect(() => {
    (async () => {
      if (firebaseUserObject) {
        const user: User = await UserCollection.getCurrentUser(firebaseUserObject.uid)
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })()
  }, [firebaseUserObject])

  useEffect(() => {
    const unsubscribe = FirebaseApp.auth().onAuthStateChanged(setFirebaseUserObject)
    return () => {
      unsubscribe()
    }
  }, [])

  return <FirestoreContext.Provider value={{ firestore, currentUser }}>{children}</FirestoreContext.Provider>
}
```

Let's break this component down a bit because there's a lot going on. Firstly, Firebase has its own type definition for a `User`, which is specifically the authenticated
user object. Almost all of the `Firebase.User` properties aren't useful in my case though. I want the actual custom `User` document from my `users` collection, not just
Firestore metadata. This is why I have two pieces of state, one for tracking the `currentUser`, which is the custom `User` document I care about, and one for the `firebaseUserObject` that represents
the authenticated `Firebase.User`.

Notice also how I define my `UserCollection` by passing the `firestore` instance to the `UserModel` class constructor.

In the initial `useEffect`, I listen for a change in the `firebaseUserObject` and when it's defined, I want to get the corresponding `User` document and set it as the `currentUser`.
The second `useEffect` houses logic to listen for changes in the authenticated user, with the subscription being destroyed when the component is unmounted.

Lastly, I pass the `firestore` and `currentUser` as the values for my Context Provider.

As another example of how I use the `UserModel` class:

```jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Error } from 'state/firebaseTypes';
import UserModel from 'state/users/userModel';
import { FirestoreContext } from 'context/FirestoreContextProvider';

//would be defined elsewhere
type FetchRequest<T, E = unknown> = { fetching: boolean; data: T; error: E | null };

const Users: React.FC = (): JSX.Element => {
  const [users, setUsers] = useState<FetchRequest<User[], Error>>({ fetching: true, data: [], error: null });
  const { firestore } = useContext(FirestoreContext);
  const UserCollection = new UserModel(firestore);

  useEffect(() => {
      (async () => {
         try {
           const data = await UserCollection.getAllUsers()
           await setUsers(prev => ({ ...prev, data }))
         } catch (error) {
            console.log(error);
            setUsers(prev => ({ ...prev, error }));
         }
      })();
    setUsers(prev => ({ ...prev, fetching: false }))
  }

...

}
```

And that's pretty much it! Like I said, I've been using this system and it's been working nicely for me so I wanted to share it to see what others thought. Would love to hear feedback/see how others are accomplishing
something similar.

Thanks for listening 👋🏻
