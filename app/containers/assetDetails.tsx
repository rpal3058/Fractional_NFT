//use to create a global state of the search result
import { createContainer } from "unstated-next"; // Unstated-next containerization
import { useState } from "react";

function useAsset (){
    const [tokenDetails, settokenDetails] = useState("");
    
    const updateTokenDetails = (input) => {
        settokenDetails(input)
    }

    return{updateTokenDetails, tokenDetails}
}

//create container 
const asset = createContainer(useAsset)
export default asset