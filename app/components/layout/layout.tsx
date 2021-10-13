import { Fragment } from 'react';

import { useEffect} from "react";
import Sidebar from "./sidebar";
import Header from "./header";

export default function Layout(props) {
  //To track the rendering flow
  useEffect(()=>{
    console.log("Loading Layout...")
  },[])
   
  return (
    <Fragment >
      <Header/>
        <Sidebar />
          {props.children}
    </Fragment> 
  );
}