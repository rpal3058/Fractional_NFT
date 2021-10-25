//Creating container to get all the important data point 
import { OpenSeaPort, Network } from 'opensea-js'
import {useState, useEffect} from "react"
import {ethers} from "ethers"; // Ethers
import { createContainer } from "unstated-next"; // Unstated-next containerization
import web3 from "./web3"

function useOpenSea (){
  // const NETWORK = process.env.NETWORK
  const {provider} = web3.useContainer() 
  const [openSeaPort, setOpenSeaPort] = useState<OpenSeaPort>()

  useEffect(() => {
    if (provider) {
      const seaport = new OpenSeaPort(provider, {
        networkName: Network.Rinkeby,
        apiKey: process.env.NEXT_PUBLIC_OPENSEA_API
      })
      setOpenSeaPort(seaport)
    }
  }, [provider]);

  return {openSeaPort}
}

//create container 
const OpenSea = createContainer(useOpenSea)
export default OpenSea