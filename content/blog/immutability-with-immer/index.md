---
title: Use Immer.js to Manage Your Immutable React State
date: "2020-5-30"
description: "Pass the reigns to Immer when it comes to maintaining immutability when working with your app state"
---
[immer-logo]: ./immer_logo.svg
![immer-logo][immer-logo]

If you've worked with React, or frankly any JavaScript framework, you've probably come across the
idea of keeping state "immutable". In other words, when working with state, you want to avoid
mutating the state object when updating a particular value. Immutability is a core concept of both
object-oriented and functional programming, so before I dive into the awesomeness of Immer, I just
want to take a brief moment to expound upon what it is and why it's important in the applications we build.
