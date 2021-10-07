import {useRouter } from "next/router";
import {ethers} from "ethers"; // Ethers
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {useEffect, useState } from "react"
import { Container } from "unstated-next"
import  Header from "../components/header"
import Layout from "../components/layout"
import { web3 } from "../containers"
import {getNftList} from "../data/functions"

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function Home() { 
  //To track the rendering flow
  useEffect(()=>{
    console.log("Loading Market Page...")
  },[]) 
  const router = useRouter()

  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const {nftMarket, signers} = web3.useContainer()
  const [addNft, setAddNft] = useState(false)
  const [load, setLoad] = useState(true)
  const [uri, setUri] = useState("")
  const [price, setPrice] = useState("")
  const [nftList, setNftList] = useState([])  


  //UPLOADING THE DATA TO IPFS
  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  //getting the details of the board the was clicked
  useEffect(()=>{
    async function fetchData(){
      if(nftMarket!=undefined)//this is to check if the metamask is connected or not
      {   
        const nftDetails = await getNftList()
        if(nftDetails!=undefined) //this is to check if the details of the nft selected has been propoerly loaded
        {
          //getting the list of nft from subgraph
          console.log("List of Boards ")
          setNftList(nftDetails)     
        }
      }
      else {
        console.log("Connect to the Provider i.e wallet like Metamask")
      }  
    }
    fetchData()
  },[load, nftMarket])

  const nftCreate = async(e) =>{
    setLoad(false) //to disable the processing icon
    e.preventDefault()
    try {
        if(nftMarket!=null){
        let listingValue = ethers.utils.parseEther(".025") //converting ether to Wei format
        const formatPrice = ethers.utils.parseEther(price)
        const tx = await nftMarket.nftCreate(uri,formatPrice, { value: listingValue })
        await tx.wait()
        setLoad(true) //to disable the processing icon
        setAddNft(false)
      }else{
        alert("Not connected to the provider (e.g MetaMask)")
        setLoad(true)
        setAddNft(false) //to close the add fund dialgue bo
      } 
    }catch (error) {
        alert(error)
        setLoad(true)
        setAddNft(false) //to close the add fund dialgue bo
      }
  }


  return(
    <div className="bg-blue-500 w-screen h-screen">
      <Layout>
            {/* Adding New NFT */}
            <div className="p-6">
            <button className="w-full bg-gray-900 cta-btn font-semibold text-white  py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center"
            onClick= {() => setAddNft(true)}
            >
              + NEW NFT
            </button>
            {addNft?
            (              
              <div className="bg-gray-900 justify-center items-center flex overflow-x-hidden 
                        overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl px-60">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
               
                    {/*header*/}
                      <div className="flex items-start justify-between p-5 rounded-t text-gray-700 text-xl font-bold ">
                          ADD NFT
                      </div>

                    {/*body*/}
                      <div className="relative p-6 flex-auto">
                        <div className="mb-4">
                          <label className="block text-gray-700 text-xl font-light mb-2">
                            NFT DETAILS
                          </label>

                          <input 
                              className="shadow appearance-none border rounded w-full py-2 px-3
                              text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" 
                              id="Name" 
                              type="text" 
                              placeholder="Name"
                              onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                          />   
                      
                          <textarea 
                              className="shadow appearance-none border rounded w-full py-2 px-3 
                              text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" 
                              id="Desription" 
                              placeholder="Description"
                              onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                          />

                          <input 
                              className="shadow appearance-none border rounded w-full py-2 px-3 
                              text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" 
                              id="Price" 
                              type="text" 
                              placeholder="Price"
                              onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                          />

                           <input
                              className="my-4"  
                              id="Asset"
                              type="file"
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
                            CREATE DIGITAL ASSET
                          </button>

                          <button
                            className="bg-emerald-500 text-black active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => setAddNft(false)}
                          >
                            CLOSE
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

         {/* Displaying NFT*/}
         <div className="flex grid-cols-3 ">
          {         
            nftList.map((nftList) => {
                return(   
                  <div className="bg-white p-2 m-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                    <div className="text-sm mt-2 px-2">
                      <div>
                        <p>{"TOKENID :  " + nftList.tokenID}</p>
                        <p>{"URI :  " + nftList.tokenURI}</p>
                        <p>{"CREATOR :  " + nftList.creator.slice(0, 5)+ "..." +nftList.creator.slice(nftList.creator.length - 5)}</p>
                        <p>{"CURRENT OWNER :  " + nftList.currentOwner.slice(0, 5)+ "..." +nftList.currentOwner.slice(nftList.currentOwner.length - 5)}</p>
                        <p>{"OPERATOR :  " + nftList.operator.slice(0, 5)+ "..." +nftList.operator.slice(nftList.operator.length - 5)}</p>
                        <p>{"SALES PRICE:  " + nftList.salesPrice}</p>
                        <p>{"SOLD:  " + nftList.sold}</p>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-1 px-1 rounded "
                          onClick={() => {
                            router.push("/" + nftList.tokenID);
                          }}
                        >
                          SELECT NFT
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
          }
        </div>                   

     </Layout>
    </div>
  )        
}