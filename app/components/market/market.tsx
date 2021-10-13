import {useRouter } from "next/router";
import {useEffect, useState } from "react"
import {getWeb3} from "../../containers"
import {getNftList} from "../../data/functions"
import Moralis from 'moralis';
import axios from "axios";
import Link from 'next/link';

export default function Market() { 
  const router = useRouter()
  const {nft,address,web3} = getWeb3.useContainer()
 
  useEffect(()=>{
    console.log("Loading Market Page...")
  },[]) 

  const [meta,setMeta] = useState([]);
  let nftDetails
  let count=0
  let tempMetaArray = []
    
  //getting all the NFT in the smart contract from the graph
  useEffect(()=>{
  async function fetchData(){
     nftDetails = await getNftList()
    if(nftDetails) //this is to check if the details from the subgraph has been propoerly loaded
    {
    //getting the list of task from subgraph
      nftDetails.map((nftDetails)=>{
          getMeta(nftDetails)     
      })
    }
  }  
    fetchData()
  },[])

  async function getMeta(e){
    if(e){
      count++
      let uri = await axios.get(e.tokenURI)
      let temp = JSON.parse(uri.data);
      let tempMeta = {
        id: e.id,
        title: temp.title,
        description: temp.description,
        image: temp.image,
        price: e.salePrice
      }
      tempMetaArray.push(tempMeta) 

      //To esnure that the data is displayed we are checking if all the nft has beena 
      //added to the array before setting the state 
      if(tempMetaArray.length==nftDetails.length){
        console.log("Complete Meta")
        console.log(tempMetaArray)
        setMeta(tempMetaArray)
      }
    }
  } 

  return(
    <div>
      <h1 className="relative  md:text-3xl font-medium my-8 px-80">NFT MARKETPLACE</h1>
      {
        meta.map((meta)=>{
          return(
            <button>
            <div className="relative ml-10 w-80 h-96 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg">
              <div className=" max-w-sm min-w-[340px] bg-white shadow-md rounded-3xl p-2 mx-1  cursor-pointer">
                <div className="overflow-x-hidden rounded-2xl relative">
                  <img className="h-40 rounded-2xl w-full object-cover" src={meta.image} ></img>
                </div>
              </div>

              <div className=" mt-2 pl-2 mb-2 py-2 break-all">
                <p className="font-semibold text-gray-900 my-1 py-2">{meta.title}</p>
                <p className="text-gray-800 my-1 py-2">{meta.description}</p>
                <p className="text-gray-800 my-1 py-2">{meta.price/1000000000000000000} Eth </p> 
               </div>

              <a >
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mx-4"
                  onClick={() => {
                    router.push("/" + meta.id);
                  }}
                  >
                BUY NOW
                </button> 
              </a>
    
            </div>  
            </button>                
          )
        })
      }
    </div>
  )
}

