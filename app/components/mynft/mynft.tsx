import {useRouter } from "next/router";
import {useEffect, useState } from "react"
import {getWeb3} from "../../containers"
import {getNftList} from "../../data/functions"
import axios from "axios";

export default function MyNft() { 
  const router = useRouter()
  const {nft,address,web3} = getWeb3.useContainer()
 
  useEffect(()=>{
    console.log("Loading my NFT Page...")
  },[]) 

  const [meta,setMeta] = useState([]);
  const [load, setLoad] =useState(true)
  const [processed, setProcessed] = useState(true)
  let nftDetails
  let tempMetaArray = []
  let count=0  

  //getting all the NFT in the smart contract from the graph
  useEffect(()=>{
  async function fetchData(){  
    if(address){
      setProcessed(false)
      //getting the list of nft from subgraph
      nftDetails = await getNftList()
      if(nftDetails){
        setProcessed(true)
        nftDetails.map((e)=>{
          if(e.currentOwner==address ) //this is to check if the details from the subgraph has been propoerly loaded
          {
            setLoad(true)
            count++
            getMeta(e)     
          }
        })
        if(count==0){
          setLoad(false) //if therre are no nft then set the load to false
        }    
      }      
    }
    else{
      setLoad(false)
    }
  }  
    fetchData()
  },[address])

  async function getMeta(e){
    if(e){
      let uri = await axios.get(e.tokenURI)
      let temp = JSON.parse(uri.data);
      let tempMeta = {
        title: temp.title,
        description: temp.description,
        image: temp.image,
        price: e.salePrice
      }
      tempMetaArray.push(tempMeta) 
    }

    //To esnure that the data is displayed properly we are checking if all the nft has beena 
    //added to the array before setting the state 
    // console.log(count)
    if(count==tempMetaArray.length){
      console.log("Complete Meta")
      console.log(tempMetaArray)
      setMeta(tempMetaArray)
    }
  } 

  return(
    <div>
      <h1 className="relative  md:text-3xl font-medium my-8 px-80">MY NFT</h1>      
      {processed?(
        load?(
         meta.map((meta)=>{
          return(
            <button>
            <div className="p-4 relative ml-10 w-80 h-80 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg">
              <div className=" max-w-sm min-w-[340px] bg-white shadow-md rounded-3xl p-2 mx-1  cursor-pointer">
                <div className="overflow-x-hidden rounded-2xl relative">
                  <img className="h-40 rounded-2xl w-full object-cover" src={meta.image} ></img>
                </div>
              </div>
              <div className=".list-none mt-4 pl-2 mb-2 pt-1 break-all">
                <p className="font-semibold text-gray-900 my-1 pt-1">{meta.title}</p>
                <p className="text-gray-800 my-1 pt-1">{meta.description}</p>
                <p className="text-gray-800 my-1 pt-1">{meta.price/1000000000000000000} Eth </p> 
              </div>
            </div>  
            </button>
          )                  
        })
        ):(
          <div>
            <h1 className="relative  md:text-2xl text-red-600 font-medium my-8 px-80">THERE ARE NO NFT</h1>
          </div>
        )
        ):(
          <div className="bg-gray-900 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">  
            <div className= "text-red-500">
                Processing...
            </div>
          </div>
        )
      }
    </div>
  )
}