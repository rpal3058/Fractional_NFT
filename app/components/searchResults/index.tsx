import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useState } from "react"
import {OpenSea,web3,asset} from "../../containers"
import { OrderSide,  } from 'opensea-js/lib/types'
import  OpenSeaPort from "opensea-js/lib/seaport";
import axios from "axios";

export default function SearchResults() {

const router = useRouter()
let {tokenDetails} = asset.useContainer()
const{openSeaPort} = OpenSea.useContainer()  
const{provider} = web3.useContainer()  
let tokenAddress= tokenDetails.tokenAddress
let tokenId= tokenDetails.tokenId
let [assets, setAssets] = useState(null)
let [loaded,setLoaded] =useState(false)


//gettign the asset details based on the search
useEffect(()=>{
  fetchTokenDetails()
},[tokenDetails])

async function fetchTokenDetails(){
  if(tokenDetails){
    let baseUrl = 'https://rinkeby-api.opensea.io/api/v1/asset/'
    let url = baseUrl.concat(tokenAddress,"/",tokenId,"/")
    let asset = await axios.get(url)
    console.log(asset)
    setAssets(asset)
    setLoaded(true)
  }
}

async function makeOffer (){
  if(openSeaPort){
    // const transactionHash = await openSeaPort.transfer({
    //   asset: { tokenId, tokenAddress },
    //   fromAddress: "0x44f003aA59aDC6122F46E8Eb170b268FA0803dBe",
    //   toAddress: "0xC586F1A96E65b815A075544262Ea1867422E9253"
    // })
  // }
// }
    let account = "0x44f003aA59aDC6122F46E8Eb170b268FA0803dBe"
  
    let order = await openSeaPort.api.getOrder({
                                            asset_contract_address: tokenAddress,
                                            token_id: tokenId,
                                            side: OrderSide.Sell
                                          })
    //let order = orders[0]                    
    console.log(order)
    // Important to check if the order is still available as it can have already been fulfilled by
    // another user or cancelled by the creator
    if (order) {
      // This will bring the wallet confirmation popup for the user to confirm the purchase
      let op = await openSeaPort.fulfillOrder({ order: order, accountAddress: account })
      console.log(op)
    }else {
      // Handle when the order does not exist anymore
      alert("heck if the order is still available")
    }
  }else{
    alert("Check if the wallet is connected")
  }
}

return(
  <div> 
    {loaded?(   
      <div className="container mx-auto px-10 mt-36  ">
      <div className="md:flex md:items-center ">  

        {/*PHOTO SECTION*/}
        <div className="w-full h-100% md:w-1/2 lg:h-96">
          <img 
            className="h-full w-full rounded-md object-cover max-w-lg mx-auto" 
            src={assets.data.image_url} 
            alt={assets.data.description}
          />
        </div>
        {/*END OF PHOTO SECTION*/}

        {/*CONTENT SECTION*/}
        <div className="w-full max-w-lg mx-auto mt-5 md:ml-8 md:mt-0 md:w-1/2">

          <a className="text-gray-700 uppercase text-lg"
              target="_blank"
             href={`https://testnets.opensea.io/assets/`+`${tokenAddress}`+`/`+`${tokenId}`+`/`}
          >
            {assets.data.name}
          </a>
          <br></br>
          <span className="text-gray-500 mt-4">Avg Price : {assets.data.collection.stats.average_price.toString().slice(0,4)}</span>
          <br></br>
          <span className="text-gray-500 mt-4">Floor Price : {assets.data.collection.stats.floor_price.toString().slice(0,4)}</span>

          <hr className="my-3"></hr>
          <div className="mt-2">
              <label className="text-gray-700 text-sm" >Details:</label>
              <a className="flex items-center mt-1 text-xs"     
                  target="_blank"             
                  href={`https://testnets.opensea.io/assets/`+`${tokenAddress}`+`/`+`${tokenId}`+`/`}
              >
                {(`https://testnets.opensea.io/assets/`+`${tokenAddress}`+`/`+`${tokenId}`+`/`).slice(0,30)+"..."}
              </a>
          </div>
          
          <div className="mt-3">
              <label className="text-gray-700 text-sm" >Token Standard:</label>
              <br></br>
              <p className="flex items-center mt-1 text-xs">{assets.data.asset_contract.schema_name}</p>
          </div>

          <div className="mt-3">
              <label className="text-gray-700 text-sm" >Owner:</label>
              <br></br>
              <p className="flex items-center mt-1 text-xs">{assets.data.asset_contract.owner}</p>
          </div>

          <div className="flex items-center mt-6">
              <button 
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
              onClick={()=>makeOffer()}
              >
                Make an Offer
              </button>
              <button 
              className="mx-2 px-8 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
              >
                Buy Now
              </button>
          </div>   
         
      </div>
      {/*END OF CONTENT SECTION*/}
      </div>
      </div>
    ):(
      <div className=" flex h-screen justify-center items-center">
       <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )}
  </div>  
  )
}


 //   let tokenAddress= "0x05d5f036c6a392cae215bf318518e8676c85183a" // CryptoKitties
  //   let tokenId= "1" // Token ID
  //   let accountAddress="0x44f003aa59adc6122f46e8eb170b268fa0803dbe"
  //   let apikey = "59d79140ee5c4686b4e8c0a7035b8761"
  //   let temp = await seaport.api.getAsset({
  //     tokenAddress,
  //     tokenId,
  //   })
  //   console.log(temp)   
  // }
  //asset Schema
      // let schemaName = assets.data.asset_contract.schema_name.toString()
      // // The offerer's wallet address:
      // const accountAddress = "0xC586F1A96E65b815A075544262Ea1867422E9253"
      // console.log(seaport)

      // const offer = await seaport.api.getOrder({
      //   asset: {
      //     tokenId,
      //     tokenAddress,
      //     schemaName 
      //   },
      //   accountAddress,
      //   // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
      //   startAmount: 1.2,
      // })
      // console.log(offer)
 