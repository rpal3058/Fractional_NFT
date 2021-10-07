import getWeb3 from "../containers/web3"
import { createContext, useEffect,useState } from 'react';
import {useRouter } from "next/router";

//DONT include async function to export since it might create problem in the child componenets
export default  function Header() {
  //To track the rendering flow
  useEffect(()=>{
    console.log("Loading Header...")
  },[])
  
  const {login,address, logout} = getWeb3.useContainer()
  

  return (
      <div className="header flex bg-blue-800  w-full px-8 py-3 justify-between items-center">
        
      </div>
  );
}
