import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useState } from "react"
import {OpenSea,web3,asset} from "../../containers"
import { OrderSide,  } from 'opensea-js/lib/types'
import axios from "axios";

export default function SearchResults() {

const router = useRouter()
let {tokenDetails} = asset.useContainer()
const{openSeaPort} = OpenSea.useContainer()  
const{account} = web3.useContainer()  

let tokenAddress= tokenDetails.tokenAddress
let tokenId= tokenDetails.tokenId
let [assets, setAssets] = useState(null)
let [loaded,setLoaded] =useState(false)


//gettign the asset details based on the search
useEffect(()=>{
  fetchAssetDetails()
},[tokenDetails])

async function fetchAssetDetails(){
  if(tokenDetails){
    if(openSeaPort){
      const asset= await openSeaPort.api.getAsset({
        tokenAddress, // strin
        tokenId, // string | number | null
      })
      setAssets(asset)
      setLoaded(true)  
    }
  }
}

async function makeOffer(){
  let order = await openSeaPort.api.getOrder({
    asset_contract_address: tokenAddress,
    token_id: tokenId,
    side: OrderSide.Sell
  })

  // Important to check if the order is still available as it can have already been fulfilled by another user or cancelled by the creator
  if (order) {
    // This will bring the wallet confirmation popup for the user to confirm the purchase
    let op = await openSeaPort.fulfillOrder({ order: order, accountAddress: account })
    console.log(op)
  }else {
    // Handle when the order does not exist anymore
    alert("heck if the order is still available")
  }
}

async function buyNow(){
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
            src={assets.imageUrl} 
          />
        </div>
        {/*END OF PHOTO SECTION*/}

        {/*CONTENT SECTION*/}
        <div className="w-full max-w-lg mx-auto mt-5 md:ml-8 md:mt-0 md:w-1/2">
          {/* <br></br>
          <span className="text-gray-500 mt-4">Avg Price : {assets.sellOrders[0].currentPrice?.toString().slice(0,4)}</span> */}
          
          <div className="mt-3">
              <label className="text-gray-700 text-sm" >Token Standard:</label>
              <p className="flex items-center mt-1 text-xs">{assets.assetContract.schemaName}</p>
              <br></br>
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

