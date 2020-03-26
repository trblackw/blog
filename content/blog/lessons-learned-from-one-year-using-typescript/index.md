---
title: Lessons I've Learned After a Year of Using TypeScript
date: "2020-03-25T00:00:00+0000"
description: "How my experience with TypeScript has made me a better developer"
---
[react-typescript]: ./react-typescript.png
![react-typescript][react-typescript]

As the title suggests, I've been using TypeScript for about a year and I'd like to share some lessons I've learned along the way. TypeScript, as with most things in life,
requires time, patience and experience to truly grasp how amazing it is. I'm still constantly learning new things about how the TypeScript compiler works and better ways
to use types in my code. These are the things I wish I could have told myself early on in my use of TypeScript, once I got comfortable with the syntax.

As a preface, I'm a React developer, so much of the anecdotes I mention will be framed in a React context, but frankly TypeScript applies to all JavaScript code!

## Trust the compiler

When I first got started with TypeScript, I was extremely diligent and frankly overzealous with granular typing. I didn't let the compiler do anything--if there was a variable
or function defined, I explicitly typed every aspect of it. Of course, one could argue that this is a good way to get yourself familiar with TS, specifically what it will admit
and what it will turn its nose up at. I look back at `.ts` or `.tsx` files I wrote over 6 months ago and frankly cringe, as I'm sure most of us do with our past code in general.

Let me give a concrete example of why trusting the compiler can reduce the code you have to write while also giving you the benefit of type safety. Let's say you have a register
form where users can sign up for your service. They just have to input an email and a confirmed password. Here's what I would have done when I first got started with TypeScript:
```typescript
import React, { useState } from 'react';

interface FormState {
  email: string;
  password: string;
  passwordConfirm: string;
}

const initialFormState: FormState = {
  email: '',
  password: '',
  passwordConfirm: ''
}

const Register: React.FC = (): JSX.Element => {
  const [form, setForm] = useState<FormState>(initialFormState)
  
  ...
}
```

Here's the thing, although all the typing might look ~_cool_~, it doesn't really provide us any benefit as a developer. This is because
TypeScript is capable of [type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html), which means that your explicit
types are, for the most part, pointless.

You could achieve the exact same type safety as above without the use of an [`interface`](https://www.typescriptlang.org/docs/handbook/interfaces.html):
```typescript
import React, { useState } from 'react';

const initialFormState = {
  email: '',
  password: '',
  passwordConfirm: ''
}

const Register: React.FC = (): JSX.Element => {
  const [form, setForm] = useState(initialFormState)
  
  ...

  form.email = 2 // Error: type number is not assignable to type string (paraphrased error)
}
```
Note however, this isn't the case for React component props. Props should always be explicitly type because where they're defined is outside of a consuming component's scope and TS is therefore not able make any type inference about them.

## Define types with others in mind

The more you work with TypeScript, the more you realize that it really isn't for _you_. By that I mean, the time you spend adding type definitions
to various portions of your API isn't necessarily just for your benefit. Other developers with less knowledge about a given codebase will be very much aided by
supporting type definitions. This is especially the case if a backend developer (not a Node.js dev) who's more familiar with statically-typed 
languages is poking around a JavaScript codebase. Being a naturally dynamic language, JavaScript can be off putting to those that aren't familiar
with it, simply because it lacks **types**, which it gains when using TypeScript.

## Apply DRY principles to your types

If you aren't familiar with the **DRY** principle, it stands for **D**on't **R**epeat **Y**ourself. This is a concept applied to writing code that
frowns upon duplicating logic in multiple places. The same mentality should be applied when defining your types/interfaces--even if it's a matter of
one or two properties. TypeScript is a particularly flexible type system thanks to its [utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html).
These, I'd argue, are essential tools in a seasoned TypeScript developer's tool belt.

Let's look at some examples.

Let's say you have a `User` interface that has all of its properties required when creating a new user, but in the case of updating a user, any of those
properties can be passed--in other words, none of the properties are explicitly required. In a world without the `Partial` utility type, this would look
something like:
```typescript
interface CreateUserRequest {
  username: string;
  age: number;
  email: string;
}

interface UpdateUserRequest {
  username?: string;
  age?: number;
  email?: string;
}

const createUser = (user: CreateUserRequest) => {
  //fetch request that requires all User properties
}

const updateUser = (user: UpdateUserRequest) => {
  //fetch request that doesn't require any User properties
}
```

The same could be achieved with the `Partial` type, but with much DRY-er code. This utility type just makes every property optional for a given type:
```typescript
interface User {
  username: string;
  age: number;
  email: string;
}

const createUser = (user: User) => {
  //fetch request that requires all User properties
}

const updateUser = (user: Partial<User>) => {
  //fetch request that doesn't require any User properties
}
```

Two other utility types that I use more often are the [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktk) and [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittk) helpers. 
These allow you to utilize already defined types/interfaces but be much more selective about certain properties. For instance, let's say I have a similar `User` 
interface as defined above, but this new `User` has some metadata that my client-side app doesn't really care about:

```typescript
interface User {
  id: string;
  updated_at: string;
  username: string;
  age: number;
  email: string;
}
```

If I have a form that pertains to a user, I can point to the same `User` interface while "omitting" the properties that I don't care about:
```typescript
type UserForm = Omit<User, 'id' | 'updated_at'>;
```
Now I'll have the same type-safety as I had with the original `User` interface, "omitting" the `id` and `updated_at` properties, which I have
no use for as a front-end dev. And when that original interface is updated, so is my form type. The inverse effect can be achieved with 
`Pick`, where you can just select a subset of properties that you 
want a given variable to adhere to.

## Cost-Benefit analysis of typing

There's been many a times where I've been trying to debug a "type" scenario and just can't seem to get passed it. If you've been there, you 
know exactly what I'm referring to. The scenario where you **know** as a developer that the type-safety for this particular portion of the app is
icing to say the least, but why your type declarations aren't working is stumping you and you refuse to give in to the type monster! Trust me,
I've been there plenty of times. The more time I've spent with TypeScript, though, the more willing I am to forfeit those battles. After all, 
typing is for a team benefit, and if the compiler is rejecting your type annotations, there's likely something wrong with your code. I'd much rather
succumb to the compiler than have to slap a `@ts-ignore` into my code. That's just me though!

I hope that these examples can help others find their way in the TypeScript pond.
