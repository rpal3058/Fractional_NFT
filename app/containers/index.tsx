import web3 from "./web3"; // web3 with Etherjs as the API 
import OpenSea from "./opensea"; //obtaining OpenSea 
import asset from "./assetDetails" //obtaining the NFT details

// Global state provider
export default function GlobalProvider({ children }) {
  return ( 
      <web3.Provider>
        <OpenSea.Provider>
          <asset.Provider>
           {children}
          </asset.Provider>
        </OpenSea.Provider>
      </web3.Provider>
  )
}

// Export individual containers
export { web3, OpenSea, asset };