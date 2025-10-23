import React,{useEffect} from 'react';
export default function App(){
     useEffect(()=>{
    console.log("component rendered");
    let timer=setTimeout(()=>{console.log("welcome")},5000)
    return()=>{
      clearTimeout(timer);
      console.log("component is unmounted")
    }
  })
    
    return(
        <>        
        <h1> i am here</h1>
       
        </>

    )
}