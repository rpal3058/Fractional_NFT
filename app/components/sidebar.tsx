import getWeb3 from "../containers/web3"
import {createContext, useEffect,useState } from 'react';
import {useRouter } from "next/router";

//DONT include async function to export since it might create problem in the child componenets
export default  function Sidebar() {
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
  const [marketPlace, setMarketPlace] = useState(false)
  const [myCollection, setMyCollection] = useState(false)
  const [ipfs,setIpfs] = useState(null)

  useEffect(() => {
    if(address){
      setConnected(true)
    }
    if(address==""){
      setConnected(false)
    }
  },[address])
  
  //routes it to the home page  
  const onHome = () => {
    router.push("/");
  };
 
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
    <div className="w-60 relative z-20 flex-shrink-0  h-screen px-2 overflow-y-auto bg-blue-800 sm:block">
       <div className="mb-6">
       <nav>             
            {/* Home button */}
            <button className="font-bold" onClick={() => onHome()}>
              <a href="#" className="text-white flex items-center space-x-2 px-4 my-8">
                    <span className="text-1xl text-white font-extrabold">NFT MARKET</span>
                </a>       
            </button>
            {/* END OF HOME BUTTON */}

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
            {/* BUTTON TO CONNECT TO THE WALLET */}
  
            <a className="block py-2 px-4 text-white my-2">
            Account:
              <div className="block py-2 px-4 text-xs text-white">
                  <h1>{accAddress.slice(0, 5) + "..." + accAddress.slice(accAddress.length - 5)}</h1>
              </div>
            </a>

            <a  className="block py-2 px-4 text-white my-2">
            Network:
              <div className="block py-1 px-4 text-xs text-white">
                  <h1>{network}</h1>
              </div>
            </a>

             {/* MARKETPLACE BUTTON */}
             <a className="block py-2 px-4 text-white my-2"> 
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setMarketPlace(true)}
              >
                MARKETPLACE
              </button>
            </a> 
            {/* END OF MARKETPLACE BUTTON */}

            {/* MY COLLECTION BUTTON */}
              <a className="block py-2 px-4 text-white my-2"> 
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setMyCollection(true)}
              >
                MY COLLECTION
              </button>
            </a> 
            {/* END OF MY COLLECTION BUTTON */}
        </nav>
        </div>
    </div>  
  )
}     