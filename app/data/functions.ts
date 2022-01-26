import client from ".";
import {
    nftDetails,
} from "./queries";

export const getNftList = async () => {
    // Collect nft details
    let nft = await client.request(nftDetails);
    nft = nft.nftEntities;
  
    // Return nft
    return nft
};    
