import { Fragment } from "react"
import {useEffect, useState } from "react"
import {getWeb3} from "../../containers"
import {getNftList} from "../../data/functions"
import {useRouter } from "next/router"
import axios from "axios"
import { BADQUERY } from "dns"

export default function HomePage() {

const router = useRouter()
const {nft,address,web3} = getWeb3.useContainer()
const [meta,setMeta] = useState([]);
const [processing, setProcessing] =useState(false)
const { nftid } = router.query;
let nftDetails
let tempMetaArray = []
let count=0  

//getting all the NFT in the smart contract from the graph
useEffect(()=>{
    async function fetchData(){  
    //getting the list of nft from subgraph
    nftDetails = await getNftList()
    console.log("Nft details" + nftDetails)
    if(nftDetails){
        nftDetails.map((e)=>{
        if(e.id==nftid) //this is to check if the details from the subgraph has been propoerly loaded
            {
            count++
            getMeta(e)     
            }
        })      
    }}
fetchData()
},[])
    
async function getMeta(e){
    if(e){
        let uri = await axios.get(e.tokenURI)
        let temp = JSON.parse(uri.data);
        let tempMeta = {
        id:e.id,
        title: temp.title,
        description: temp.description,
        image: temp.image,
        price: e.salePrice,
        creator:e.creator
        }
        tempMetaArray.push(tempMeta)
        console.log(tempMetaArray)
        setMeta(tempMetaArray)
        setProcessing(true)
    }
} 
const buy = async()=>{
    setProcessing(false)    
    try {
        if(web3!=null){
        // let listingValue = web3.utils.toWei(".025", 'ether') //converting ether to Wei format. Note the output will be a BN
        // let formatPrice = web3.utils.toWei(price.toString(),"ether")  //converting ether to Wei format. Note the output will be a BN
        const tx = await nft.methods.nftSale(meta[0].id).send({from:address, value:meta[0].price}) 
            if(tx){
                setProcessing(true) //to disable the processing icon
                router.push("/") //closing the button
            }  
        }
        else //rechecking if the wallet is connected
        {
            alert("Not connected to any wallet")
            router.push("/") 
        }
    }catch (error) {
        alert(error)
        router.push("/")
    }
}
  
return (
     <div className="fixed bg-gray-900  items-center flex overflow-x-hidden overflow-y-auto inset-0 z-20 ">
    {processing ?(
        <div className="max-w-lg mx-auto">
            {/*header*/}
            <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                <a>
                    <img className="rounded-t-lg" src={meta[0].image} alt=""/>
                </a>
                <div className="p-5">
                <a>
                    <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">{meta[0].title}</h5>
                </a>

                <p className="font-normal text-gray-700 mb-3">{"Description : " +   meta[0].description}</p>
                <p className="font-normal text-gray-700 mb-3">{"Price : " + meta[0].price/1000000000000000000 + " Eth"}</p>
                <p className="font-normal text-gray-700 mb-3">{"Creator : " + (meta[0].creator).slice(0, 5) + "..." +(meta[0].creator).slice((meta[0].creator).length - 5)}</p>
          
                <button 
                className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={()=>buy()}
                >
                 BUY
                </button>

                <button 
                className="bg-emerald-500 text-black active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={()=>router.push("/")}
                >
                 CLOSE
                </button>

                </div>
            </div>
        </div>    
    ):(
        <div className="bg-gray-900 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">  
            <div className= "text-red-500">
                Processing...
            </div>
        </div>
    )}     
    </div>
)}