import getWeb3 from "../../containers/web3"
import {useEffect,useState } from 'react';
import {useRouter } from "next/router";
import { createContainer } from "unstated-next"; // Unstated-next containerization
import { Fragment } from 'react';
import Link from 'next/link';
  
//DONT include async function to export since it might create problem in the child componenets
export default function Sidebar() {
  //To track the rendering flow
    useEffect(()=>{
    console.log("Loading Side Bar...")
    },[])

  const {login, address, web3,logout} = getWeb3.useContainer()  
  const router = useRouter()

  const [addressReceived,setAddressReceived] = useState(null)
  const [connected, setConnected] = useState(false)
  const [accAddress, setAccAddress] = useState("")
  const [network,setNetwork] = useState("...")

  useEffect(() => {
    if(address){
      setConnected(true)
    }
    if(address==""){
      setConnected(false)
    }
  },[address])
 
  useEffect(()=>{
    setAccAddress(address)
    console.log("Testing Address : "+ address)
    console.log("Testing Web3 : " + web3)

    
    async function fetchdata(){
        if(web3){
            let netId
            netId = await web3.eth.getChainId()
            if(netId){
            switch (netId) {
                case 4:
                  setNetwork("RINKEBY TESTNET")
                  break
                case 80001:
                  setNetwork("MUMBAI TESTNET")                    
                  break
                default:
                  alert("Network not recognised. Contract is deployed in Rinkeby and Mumbai testnet only")
                  logout()
              }
            }
        }
        else{
            setNetwork("...")
        }
    }
    fetchdata();
  },[address,web3])
  
  return (
    <Fragment>
    <div className="float-left auto w-60 relative z-20 flex-shrink-0 py-2  h-screen px-2 overflow-y-auto bg-blue-800 sm:block">
       <div className="mb-6">
       <nav>             
            {/* BUTTON TO CONNECT TO THE WALLET */}
            {connected ? (
            <a className="block py-6 px-4 text-white my-2">
              <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => logout() }
              >
                DISCONNECT
              </button>
            </a>
            ) : (
            <a className="block py-2 px-4 text-white my-2"> 
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => login()}
              >
                CONNECT
              </button>
            </a>  
            )}
            {/* END BUTTON TO CONNECT TO THE WALLET */}
            <br></br>  
            <a className="block py-2 px-4 text-white my-2">
            Account:
              <div className="block py-2 px-4 text-xs text-white">
                  <h1>{accAddress.slice(0, 5) + "..." + accAddress.slice(accAddress.length - 5)}</h1>
              </div>
            </a>
            <br></br>

            <a  className="block py-2 px-4 text-white my-2">
            Network:
              <div className="block py-1 px-4 text-xs text-white">
                  <h1>{network}</h1>
              </div>
            </a>
            <br></br>  
            {/*CREATING NEW NFT*/ }
            <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-4 my-4">
              <Link href='/createNft'>+ NFT CREATE</Link> 
            </a>
            {/*END OF CREATING NEW NFT*/ }
        </nav>
        </div>
    </div>
    </Fragment>  
  )
}     

