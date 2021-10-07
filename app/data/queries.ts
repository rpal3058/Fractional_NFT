import { gql } from "graphql-request"; // graphql query language

// Collect information BOARD 
export const nftDetails = gql`
  {
    nftEntities{
    id
    tokenID
    tokenURI
    creator
    currentOwner
		operator
		salePrice
		sold
  }
}`;

