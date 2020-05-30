---
title: Let’s build a functional, reusable Modal component in React with Portals
date: "2019-02-01"
description: Using React portals and React hooks to create a pleasant, reusable modal experience
---
[react_portals]: ./react_portals.jpeg
[modal_example]: ./modal-example.png
![React portals logo][react_portals]

Modals have become integral parts of applications across all devices, but their implementations vary greatly. I think that the common opinion is that it requires a little bit of CSS wizardry (something to do with the z-index or something right??), but I’ve come up with a method that has been working for me quite successfully in a few of my projects, and I’d like to share it with you (it does use a littttle bit of CSS magic though, of course).

As the title suggests, there will be no class-based components involved, as I’m an avid fan of React Hooks (if you don’t know about Hooks, check out one of my other blog posts or reference the React docs to learn more about them). So let’s get started. We will make use of my favorite library when it comes to styling React, [styled-components](https://www.npmjs.com/package/styled-components).

For simplicity, I’m going to explain the use-case for this type of the component in the context of a React app built with create-react-app. In your public directory (where you likely rarely ever venture), inside `index.html` add an anchor point for our soon-to-be Modal component right below that for our App.

```html{numberLines: true}
...
<div id="root"></div>
<div id="modal"></div>
...
```

And that’s it! That’s all there is to it. Just kidding. Back in our src directory, let’s create our Modal component in `src/Modal.js`:

```jsx{numberLines: true}
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import PropTypes from "prop-types";

const Portal = ({ children }) => {  
 const modalRoot = document.getElementById("modal");
 const el = document.createElement("div");
  
 useEffect(() => {    
  modalRoot.appendChild(el);  
 }, []);    
 
 useEffect(() => {    
  return () => modalRoot.removeChild(el); 
 });   
 
 return createPortal(children, el);
 };
 
 const Modal = ({ children, toggle, open }) => (  
   <Portal>    
      {open && (      
         <ModalWrapper>       
         <ModalCard>          
         <CloseButton onClick={toggle}>            
            <img src="https:icon.now.sh/x/ff0000" alt="close" /
         </CloseButton>
            {children}
         </ModalCard>
         <Background onClick={toggle} />      
         </ModalWrapper>    
      )}  
   </Portal>
); 

export default Modal; 

Modal.propTypes = {  
 children: PropTypes.arrayOf(PropTypes.object).isRequired,
 toggle: PropTypes.func.isRequired,
 on: PropTypes.bool.isRequired
}; 

const ModalWrapper = styled.div`
  position: fixed;  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCard = styled.div`
  position: relative;
  min-width: 320px;
  z-index: 10;
  margin-bottom: 100px;
  background: white;
  border-radius: 5px;
  padding: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
`; 

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  background: transparent;
  padding: 10px;
  &:hover {    
    cursor: pointer;
  }`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: black;
  opacity: 0.5;
`;
```

Woah! That looks like a lot of crap. It’s really not, let’s dissect it. First of all, notice that this is two components in one. I’m all for separating components into their own respective files, but the Portal I’m creating with `React.createPortal`, which we’ll get to in a minute, is intended solely for the proceeding Modal component. I feel as though it’s okay to have them live in the same file.

For those that aren’t familiar with styled-components, everything defined below the Modal’s prop-types are styled-components, which warrant a post of their own (and are extremely awesome).

So what are “portals” in React? Well, according to the [React docs](https://reactjs.org/docs/portals.html)

>“Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.”

I’ll also quote [Siobhan Mahoney](https://medium.com/@siobhanpmahoney), who explained it nicely when she stated, in her article titled, [“Portals in React.js”](https://medium.com/@siobhanpmahoney/portals-in-react-js-5d98bb89797c), 
>“portals can be used to render an element outside of its parent component’s DOM node while preserving its position in the React hierarchy, allowing it to maintain the properties and behaviors it inherited from the React tree.”

I’d rather quote others than explain it myself, because, full transparency, just because I like to use Portals doesn’t mean I fully understand them!

Okay, so now that we have a general understanding of Portals in React, let’s walk through the Portal component defined above. Notice how I’m destructuring children from props and then pass it as the first argument to `React.createPortal`.

Again, quoting the React documentation:
>The first argument is any [renderable React child](https://reactjs.org/docs/react-component.html#render), such as an element, string, or fragment. The second argument is a DOM element [acting as a container for the React child]”. That ‘container’ is created at the top of the Portal component, right after grabbing the anchor point we established previously in `index.html`.

Within the first useEffect Hook, which is equivalent to the componentDidMount life-cycle method in class-based React, we mount our container element. In the second useEffect, similar to componentWillUnmount, we dismount, or clean up after ourselves essentially.

Now here’s where things get interesting. Let’s walk through the Modal component, which makes use of our newly created React Portal. Notice how this component makes use of a `toggle` and `on` prop, the former for toggling view-ability of the modal and the latter serving as boolean property to determine if it the modal is “on” or “off” (“open” or something to that effect would also work — the naming is arbitrary). Within this Modal component, we render the previously defined Portal component, making use of our fancy styled-components to make it look pretty. All this component does, essentially, is pass the children to the instance of the React Portal. The UI for this would look something like this (from a previous contact application I made):
![Example use of modal component][modal_example]

The close button at the top right, as well as the bolder red X each make use of the toggle handler to close the modal and you can connect whatever other click handlers your heart desires within the Modal depending on your use case. I won’t go into the CSS involved in the styled-components because, for one, boring, for two, it’s something that you can write (or copy) once and never have to deal with again.

A React Hook I often use in conjunction with this Modal component is a custom useToggle Hook I wrote, which I discussed in further detail in a previous post. Together, each of these components provide a truly reusable and dare I say it pretty darn spiffy looking modal experience for you to use in your React Apps! I hope this could be of use to you, because I sure do use it every time I need a modal.

Thanks for listening 👋🏻
