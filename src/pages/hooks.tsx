import React from "react"
import Code from "components/code"
const Hooks = () => {
  return (
    <div>
       custom hook
      <Code
        snippet={`import { useEffect, useState } from 'react';

type Dimension = { height: number; width: number };

const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

export default (): [Dimension] => {
   const [windowDimensions, setWindowDimensions] = useState<Dimension>({ height, width });
   const deriveWindowDimensions = (): void => {
      //cross browser compatible
      const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      setWindowDimensions({ height, width });
   };

   useEffect(() => {
      deriveWindowDimensions();
      window.addEventListener('resize', deriveWindowDimensions);

      return () => {
         window.removeEventListener('resize', deriveWindowDimensions);
      };
   }, [height, width]);

   return [windowDimensions];
};`}
      />
    </div>
  )
}

export default Hooks
