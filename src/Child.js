import React from 'react';
const Child=React.memo(({onclick})=>{
  
  console.log("rendered");
  return(
 <button onClick={onclick}>click</button>
  )



}

)
export default Child;