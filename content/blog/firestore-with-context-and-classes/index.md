---
title: Managing Google Cloud's Firestore with React Context and Classes
date: 2020-03-20T00:00:00+0000
description: Manage your Firestore app's Auth with Firestore & database logic with classes
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

Once you've got your config handy and the necessary packages installed, you're now ready to instantiate your Firestore 🔥. Define a file in the root of your aoo titled `firestore` (name doesn't matter) where the Firestore appI
will be defined and exported:

```jsx
import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase';
export default initializeApp(firebaseConfig);
```

As you can see, there's not a lot going on here. Note that I'm importing my project's config and passing it to Firebase's `initializeApp` function. What's returned from this will be the Firestore app, but I don't need access to it in this file so I immediately export it.
Pretty straightforward, but I still need to do a few more things before I'm cooking with gas. I want to be able to:

1. abstract/organize the CRUD logic for each of my [Firestore collections](https://firebase.google.com/docs/firestore/data-model#collections) into JavaScript classes
2. login/have access to the current user
3. share my app's Firestore with every class that requires it

## Firestore CRUD abstraction

React hooks have made programming in React much more functional and declarative, which I really enjoy personally, but I feel that there's perks to using classes when it comes to working with Firestore collections.
I'll get into some examples momentarily, but inheritance helps to keep my CRUD logic DRY (**D**on't **R**epeat **Y**ourself) when it comes to defining common collection methods.

So I'll define a class for each one of my collections that will contain various methods for querying/writing/updating collections and the [documents](https://firebase.google.com/docs/firestore/data-model#documents) they contain.
If you've ever worked with MongoDB, this is a similar style that's used when interacting with your database using Mongoose. Before defining any collection classes though, I first want to define
a parent class from which all other collection classes will inherit. I've titled this file `firestoreModel` and placed it in the root of my `state` directory, in which all other model classes will live:

```typescript
import FirebaseApp from '../../firestore';
import { Firestore } from '../types';

export enum TopLevelCollections {
    USERS = 'users',
}

export default class FirestoreModel {
    public store: Firestore;
    constructor() {
        this.store = FirebaseApp.firestore();
    }
}
```

Couple of things to address here. Upon invoking the `FirestoreModel` class, I'll initialize my app's Firestore by calling its `firestore` method and store the returned result in a `store` variable which all other
classes that extend my `FirestoreModel` will be able to access. As a reminder, the `FirebaseApp` is the return value of `initializeApp(firebaseConfig)`.

Now I'll define a collection class for `users` that inherits from the `FirebaseModel` class, as well as a `getAllUsers` and a `getCurrentUser` method. Our `currentUser`
will be defined in an upcoming step:

```typescript
import FirestoreModel, { TopLevelCollections } from '../firestoreModel';
import { User } from './userTypes';

class UserModel extends FirestoreModel {
    get collection() {
        return TopLevelCollections.USERS;
    }

    public async getCurrentUser(userId: string): Promise<User> {
        const currentUserDocument = await this.store
            .collection(this.collection)
            .doc(userId)
            .get();
        return { ...currentUserDocument.data(), id: currentUserDocument.id } as User;
    }

    public async getAllUsers(): Promise<User> {
      const userCollection = await this.store.collection(this.collection).get();
      return userCollection.docs.map(user => ({ ...user.data(), id: user.id })) as User[]
    }
}
```

I'll get into some examples of how this `UserModel` is used shortly, but the defined methods are pretty basic top-level collection queries. A quirk of querying Firestore, of which there are several,
is that the documents that are returned essentially have to be "unzipped" before their properties are accessible, which is achieved by calling the documents `data` method. Also, if
you want access to the document's `id`, you have to manually add it to the return object 🤷🏻‍♂️.

## Firebase Authentication

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

## Defining the Firestore Auth Context

As a quick preface to getting into React Context code, I'm a firm believer that Context is not intended to replace Redux as a global state manager--it is intended for
sharing **contextual** data that will not be updated often without having to drill props through multiple component levels. I'll include a `currentUser` in this Context, which is relatively static and thus passes the _is it contextual?_ test.

When defining instances of Context, I prefer to create wrapper React components that render children that have access to it, as opposed to exporting the return value of `React.createContext` and wrapping various parts of my app in 
a [Context Provider](https://reactjs.org/docs/context.html#contextprovider). I think it's a nice way to contain any specific update logic for distinct pieces of Context.

```jsx
import React, { createContext, ReactNode, useEffect, useState } from "react"
import { User as FirebaseUser } from "firebase/app"
import { Firestore } from "firebaseTypes"
import FirebaseApp from "../index"
import { User } from "state/users/userTypes"
import UserCollection from "state/users/userModel"

type FirestoreAuthContextType = {
  currentUser: User | null
}

export const FirestoreAuthContext = createContext<FirestoreAuthContextType>({
  currentUser: null
})

export default function FirestoreContextProvider({ children }: { children: ReactNode }) {
  const [firebaseUserObject, setFirebaseUserObject] = useState<FirebaseUser | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

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

  return <FirestoreAuthContext.Provider value={{ currentUser }}>{children}</FirestoreAuthContext.Provider>
}
```

Let's break this component down a bit because there's a lot going on. Firstly, Firebase has its own type definition for a `User`, which is specifically the authenticated
user object. Almost all of the `Firebase.User` properties aren't useful in my case though. I want the actual custom `User` document from my `users` collection, not just
Firestore metadata. This is why I have two pieces of state, one for tracking the `currentUser`, which is the custom `User` document I care about, and one for the `firebaseUserObject` that represents
the authenticated `Firebase.User`.

In the initial `useEffect`, I listen for a change in the `firebaseUserObject` and when it's defined, I want to get the corresponding `User` document and set it as the `currentUser`.
The second `useEffect` houses logic to listen for changes in the authenticated user, with the subscription being destroyed when the component is unmounted.

Lastly, I pass the `currentUser` as the values for my Context Provider.

As another example of how I use the `UserModel` class:

```jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Error } from 'state/firebaseTypes';
import UserCollection from 'state/users/userModel';
import { FirestoreContext } from 'context/FirestoreContextProvider';

//would be defined elsewhere
type FetchRequest<T, E = unknown> = { fetching: boolean; data: T; error: E | null };

const Users: React.FC = (): JSX.Element => {
  const [users, setUsers] = useState<FetchRequest<User[], Error>>({ fetching: true, data: [], error: null });

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
