import {web3, asset} from "../../containers"
import {useRouter } from "next/router"
import {useEffect,useState } from 'react'
import Link from 'next/link'

export default function Header() {
  //To track the rendering flow
  useEffect(()=>{
  console.log("Loading Header...")
  },[])

  const {connect, account} = web3.useContainer()  
  let nft = asset.useContainer()
  const router = useRouter()
  const [searchInput, setSearchInput] = useState("")

  const onConnect = async () => {
    await connect();
  };

  const onSearch = async () =>{
    let tokenAddress = searchInput.substring(
        searchInput.indexOf("assets/") + 7, 
        searchInput.lastIndexOf("/")
    )

    let tokenId = searchInput.substring(
      searchInput.lastIndexOf("/") + 1,
    )

    let token_details ={
      tokenAddress,
      tokenId
    }
    nft.updateTokenDetails(token_details)
    
    router.push("/search")
  }
 
  return(
    <div className="flex align-items:centre justify-between bg-blue-800 p-4 ">        
      {/* Home button */}
        <a className="m-4 align-items: centre text-1xl text-white font-extrabold ">
          <Link href='/'>FRACTIONAL NFT</Link>
        </a>
      {/* END OF HOME BUTTON */}

      {/* SEARCH SECTION */}
      <div className="flex items-center justify-center ">
          <div className="flex border-2 border-blue-500 rounded">
              <input type="text" className="px-4 py-2 w-80" placeholder="copy past the URL of the NFT..."
              onChange={e=>setSearchInput(e.target.value)}
              />
              <button className="px-4 text-white bg-blue-500 hover:bg-blue-700 border-l "
              onClick={() => onSearch() }
              >
                  Search
              </button>
          </div>
      </div>
      {/* END OF SEARCH SECTION */}

      {/* BUTTON TO CONNECT TO THE WALLET */}
      {account ? (
          <div
            className="bg-blue-500 hover:bg-blue-700 flex items-center justify-center text-white font-bold px-4 my-2 mx-4 rounded"
          >
            {account.slice(0, 5) + "..." + account.slice(account.length - 5)}
          </div>
        ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 my-2 mx-4 rounded"
          onClick={() => onConnect()}
        >
          Connect
        </button>
      )}
      {/* END BUTTON TO CONNECT TO THE WALLET */}       
    </div>
  )
}