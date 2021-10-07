import {useRouter } from "next/router";
//import {ethers} from "ethers"; // Not reuried since we are using Web3 obtained from Moralis in web3 in Component
import {useEffect, useState } from "react"
import React from 'react'
import { Container } from "unstated-next"
import Layout from "../components/layout"
import {getWeb3} from "../containers"
//import {getSidebar} from "../components"
import {getNftList} from "../data/functions"
import Moralis from 'moralis';
import axios from "axios";

export default function Home() { 
  const router = useRouter()
  const {nft,address,web3} = getWeb3.useContainer()
  //const {myCollection, marketPlace} = getSidebar.useContainer()
  

  //To track the rendering flow
  useEffect(()=>{
    console.log("Loading Market Page...")
  },[]) 

  const [addNft, setAddNft] = useState(false)
  const [load, setLoad] = useState(true)
  const [nftList, setNftList] = useState([])  
  const [fileUrl, setFileUrl] = useState(null)
  const [price,setPrice] = useState(null)
  const [formInput, setFormInput] = useState({title: '', description: ''})
  const [uri, setUri] = useState("")
  const [meta,setMeta] = useState([]);
  let tempMetaArray = []
  let count = 1;
  //getting all the NFT in the smart contract from the graph
  useEffect(()=>{
  
    async function fetchData(){
      let nftDetails = await getNftList()
      if(nftDetails) //this is to check if the details from the subgraph has been propoerly loaded
      {
        //getting the list of task from subgraph
        if(web3) //if it is connected to a waller display the NFT owned by the 
        {
          nftDetails.map((nftDetails)=>{
            if(nftDetails.currentOwner==address)
            {
              setNftList(nftDetails)     
            }

          })
        }
      }
    }  
    fetchData()
  },[])

  //getting the details from the IPFS regarding the title, description, image URL
  useEffect(()=>{
    async function getMeta(){

      console.log("NFT List : ")
      console.log(nftList)
  
      if(nftList){
        nftList.map(async (e) => {
          await axios
          .get(e.tokenURI)
          .then(res => {
            var temp = JSON.parse(res.data);
            const tempMeta = {
              title: temp.title,
              description: temp.description,
              image: temp.image
            };
              tempMetaArray.push(tempMeta)
            })
        })
         console.log("IPFS Details stored in Meta state  : " )
         console.log(tempMetaArray)
         setMeta(tempMetaArray)
      }
    }  
    getMeta()
  },[nft])

  //counter to ensure the the meta is reloaded so that it is displayed on the page 
  useEffect(()=>{
    console.log("Counter : " + count)
    if(count<=3){
      count=count+1
    }
  },[meta])

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
    }catch (error) //Checking if the wallet is connected
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
    }catch{
      alert("Not connected to any wallet")
      setLoad(true) //to disable the processing icon
      setAddNft(false)  
    }
  }  

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

 
  return(
    <div className="flex h-screen w-screen">
      <Layout>
      </Layout>
      {/* Main Content Section */}
        <main className="relative flex-1 pb-8 pt-6 px-6 bg-white">
          {/*NFT ADD BUTTON*/}
          <div>
            <button className="px-4 w-full bg-gray-900 cta-btn font-semibold text-white  py-2 mt-5 shadow-lg hover:shadow-xl hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center"
            onClick= {() => setAddNft(true)}
            >
              + NEW NFT
            </button>
            {addNft?
              (              
                <div className="bg-gray-900 justify-center items-center flex overflow-x-hidden 
                          overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-auto my-6 mx-auto max-w-1xl px-60 ">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                
                      {/*header*/}
                        <div className="flex max-w-screen-2xl  items-start justify-between p-5 rounded-t text-gray-700 text-xl font-bold ">
                            ADD NFT
                        </div>

                      {/*body*/}
                        <div className="relative p-6 flex-auto ">
                          <div className="mb-4">
                            <label className="block text-gray-700 text-xl font-light ">
                              NFT DETAILS
                            </label>

                            <input 
                              placeholder="Asset Name"
                              className="mt-8 border rounded p-4 "
                              onChange={e => setFormInput({ ...formInput, title: e.target.value })}
                            />
                            <br></br>
                            <textarea
                              placeholder="Asset Description"
                              className="mt-2 border rounded p-4"
                              onChange={e => setFormInput({ ...formInput, description: e.target.value })}
                            />
                            <br></br>
                            <input
                              placeholder="Asset Price in Eth"
                              className="mt-2 border rounded p-4"
                              onChange={e => setPrice(e.target.value)}
                            />
                            <br></br>
                            <input
                              type="file"
                              name="Asset"
                              className="my-4"
                              onChange={onChange}
                            />
                            {
                              fileUrl && (
                                <img className="rounded mt-4" width="350" src={fileUrl} />
                              )
                            }                        
                          </div>
                        </div>
                          
                      {/*footer*/}
                        {load ?(
                          <div className="flex items-center justify-end p-6  rounded-b">
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
                  </div> 
              ):null
            } 
          </div>  
          {/*END OF ADD NFT BUTTON*/}
        
          {/*NFT DASHBOARD SECTION*/}
            <h2>NFT List</h2>

            {
              (meta[0]!=undefined) ?(
              <p>this is meta  : {meta[0].image}</p>
              ):(<p>There is no meta</p>)
                // meta.map((meta,i) => {
                //   console.log("Map test" + meta)
                //   return(<li key={i}>Test Map</li>)
                // }) 
            }            
          {/*END OF NFT DASHBOARD SECTION*/} 
      
      </main>
      </div>
  )        
}


{/* <div className="relative w-80 h-80 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg">

<div className=" max-w-sm min-w-[340px] bg-white shadow-md rounded-3xl p-2 mx-1 my-3 cursor-pointer">
  <div className="overflow-x-hidden rounded-2xl relative">
    <img className="h-40 rounded-2xl w-full object-cover" src={meta.image} ></img>
  </div>
</div>

<div className="mt-4 pl-2 mb-2 flex justify-between ">
  <div>
    <p className="text-lg font-semibold text-gray-900 mb-0">NFT DETAILS</p>
    <p className="text-md font-semibold text-gray-900 mb-0">{meta.title}</p>
    <p className="text-md text-gray-800 mt-0">{meta.description}</p>
    <p className="text-md text-gray-800 mt-0">{price}</p>
  </div>
</div>

</div> */}
