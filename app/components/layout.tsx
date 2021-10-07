import { useEffect} from "react";
import Sidebar from "./sidebar";

export default function Layout(props) {
  //To track the rendering flow
  useEffect(()=>{
    console.log("Loading Layout...")
  },[])
   
  //refer : https://nextjs.org/docs/basic-features/layouts
  return (
    <div>
      <Sidebar/>
        {props.children}
    </div> 
  );
}