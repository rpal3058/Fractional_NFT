import { Fragment } from "react";
import {useEffect, useState } from "react"
import Moralis from 'moralis';
import {getWeb3} from "../containers"
import { TransactionDescription } from "ethers/lib/utils";
import {useRouter } from "next/router";

export default function HomePage() {
    const {nft,address,web3} = getWeb3.useContainer()
    const [formInput, setFormInput] = useState({title: '', description: ''})
    const [price,setPrice] = useState(null)
    const [fileUrl, setFileUrl] = useState(null)
    const [load, setLoad] = useState(true)
    const [addNft, setAddNft] = useState(true)
    const [uri, setUri] = useState("")
    const router = useRouter()
   
useEffect(()=>{
    if(addNft==false){
        router.push("/");
    }
},[addNft])    
 
const onChange = async(e) =>{
    // Save file input to IPFS
     setLoad(false)
    try{
      const _nft = new Moralis.File("nft.jpg", e.target.files[0])
      let tx = await _nft.saveIPFS()
     if(tx){
      setLoad(true) //to disable the processing icon
      setFileUrl(_nft.ipfs())
     }
    }
    catch (error) //Checking if the wallet is connected
    {
      alert("Try connecting to the wallet")
      setLoad(true)
      setAddNft(false)  
    }
}

const nftCreate = async(e) =>{
    setLoad(false) //to disable the processing icon
    e.preventDefault()

    //converting the input to JSON
    let data
    const { title, description} = formInput
    if (title || description || price || fileUrl){
        data = JSON.stringify({title, description, image: fileUrl})
    }else{
        alert("Details not provided")
        setLoad(true) //to disable the processing icon
        setAddNft(false) //closing the form box
        return
    }

    try{
     //Creating another IPFS link storing all the information i.e title,description,price,IPFS url
     const file = new Moralis.File("tokenURI.json", {base64 : btoa(JSON.stringify(data))})
     await file.saveIPFS();
     console.log("Obtaining IPFS of the JSON : " + file.ipfs()) 
     setUri(file.ipfs())
     }
      catch{
        alert("Not connected to any wallet")
        setLoad(true) //to disable the processing icon
        setAddNft(false)  
      }
}  

//Note: to ensure the transaction  happens only after the URI has been set so we are calling transact within useEffect 
useEffect(()=>{   
 const transact = async() =>{  
 setLoad(false) //to disable the processing icon
 console.log("Checking URI : " + uri)
 try {
  if(web3!=null){
  let listingValue = web3.utils.toWei(".025", 'ether') //converting ether to Wei format. Note the output will be a BN
  let formatPrice = web3.utils.toWei(price.toString(),"ether")  //converting ether to Wei format. Note the output will be a BN
  const tx = await nft.methods.nftCreate(uri,formatPrice).send({from:address, value:listingValue}) 
    if(tx){
    setLoad(true) //to disable the processing icon
    setAddNft(false) //closing the form box
    }  
  }
 else //rechecking if the wallet is connected
  {
    alert("Not connected to any wallet")
    setLoad(true) //to disable the processing icon
    setAddNft(false)  
  }
 }catch (error) {
    alert(error)
    setLoad(true)
    setAddNft(false) //to close the add fund dialgue bo
 }
}
if(uri){
    transact()
}
},[uri])

return (
    <Fragment>
     <div className="fixed bg-gray-900  items-center flex overflow-x-hidden overflow-y-auto inset-0 z-20 ">
    {/*content*/}
      <div className="mx-96 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        
    {/*header*/}
     <div className="flex max-w-screen-2xl  items-start justify-between px-6 py-4 rounded-t text-gray-700 text-xl font-bold ">
        ADD NFT DETAILS
     </div>

    {/*body*/}
        <div className="px-6 justify-items-center">
            <br></br>
            <input 
            placeholder="Asset Name"
            className="mx-20 w-9/12 mt-2 border rounded p-4 "
            onChange={e => setFormInput({ ...formInput, title: e.target.value })}
            />
            <br></br>
            <textarea
            placeholder="Asset Description"
            className="mx-20 w-9/12 mt-2 border rounded p-4"
            onChange={e => setFormInput({ ...formInput, description: e.target.value })}
            />
            <br></br>
            <input
            placeholder="Asset Price in Eth"
            className="mx-20  mt-2 w-9/12 border rounded p-4"
            onChange={e => setPrice(e.target.value)}
            />
            <br></br>
            <input
            type="file"
            name="Asset"
            className="my-6"
            onChange={onChange}
            />
            {
            fileUrl && (
                <img className="rounded mt-2" width="350" src={fileUrl} />
            )
            }                        
        </div>
        
    {/*footer*/}
        {load ?(
        <div className="flex items-center justify-end p-4     rounded-b">
            <button
            className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={(e) => nftCreate(e)}
            >
            Add
            </button>

            <button
            className="bg-emerald-500 text-black active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setAddNft(false)}
            >
            Close
            </button>
        </div>  
        ):(
            <div className="flex items-center justify-end p-6  rounded-b">  
            <button type="button" className="text-red-500" disabled>
                <svg className="animate-spin h-1 w-1 mr-1 ..." viewBox="0 0 24 24">
                </svg>
                Processing...
            </button>
            </div>  
         )
        }
        </div>
      </div>
    </Fragment>

)
}