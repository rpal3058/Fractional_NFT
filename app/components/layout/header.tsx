import getWeb3 from "../../containers/web3"
import {useEffect,useState } from 'react';
import { createContainer } from "unstated-next"; // Unstated-next containerization
import Link from 'next/link';

export default function Header() {
  const [marketPlace, setMarketPlace] = useState(false)
  const [myCollection, setMyCollection] = useState(false)
  return(
  <div className="bg-blue-800 py-4 display: flex align-items: baseline align-items: centre">        
      {/* Home button */}
        <a className="mx-8 text-1xl text-white font-extrabold">
          <Link href='/'>NFT MARKET</Link>
        </a>
      {/* END OF HOME BUTTON */}

      <div className="align:left mx-8">
        {/* MARKETPLACE BUTTON */}
        <a className="hover:bg-blue-300 text-white px-4 rounded">
            <Link href='/'>MARKET</Link>
        </a>
        {/* END OF MARKETPLACE BUTTON */}

        {/* MY COLLECTION BUTTON */}
        <a className="hover:bg-blue-300 text-white px-4 rounded">
            <Link href='/mynft'>MY COLLECTION</Link>
        </a>
        {/* END OF MY COLLECTION BUTTON */}
      </div>

  </div>
  )
}