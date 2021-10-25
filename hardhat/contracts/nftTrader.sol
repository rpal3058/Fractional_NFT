// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//NOTE:
//this contract creates marketplace where the NFT created can be traded 
//https://docs.openzeppelin.com/contracts/4.x/api/token/erc721
//https://docs.openzeppelin.com/contracts/4.x/erc721

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract nftMarket is ERC721URIStorage, ReentrancyGuard{
    event nft_Created(uint tokenID, string tokenURI, address owner, address operator, uint price, bool sold);
    event nft_Sale (uint tokenID,address newOwner, bool sold); 

    constructor() ERC721("myNFT","NFT"){        
    }
    
    using Counters for Counters.Counter;
    Counters.Counter public tokenID; 
    
    struct nftStruct{
        uint256 tokenID;
        address creator;
        address currentOwner;
        uint256 salePrice;
        bool sold;
    }   
    
    mapping (uint => nftStruct) public nftDetails; 
    uint256 public listingPrice = .025 ether;
    
    function nftCreate(string memory _tokenURI, uint256 _price) public payable  //_tokenURI would store the URL/description in JSON of the item
    {
        require(msg.value>=.025 ether, "Please pay the listing price");
        
        //Creating the token
        tokenID.increment();
        uint256 currentTokenID = tokenID.current();
        _mint(msg.sender, currentTokenID);
        _setTokenURI(currentTokenID,_tokenURI);
        setApprovalForAll(address(this), true); //we are approving market to transact the NFT our behalf
        
        //Updating the nft struct with the details
        require(balanceOf(msg.sender)!=0, "The token creation was not succesful");
        nftDetails[currentTokenID].tokenID = currentTokenID;
        nftDetails[currentTokenID].creator = msg.sender;
        nftDetails[currentTokenID].currentOwner = msg.sender;
        nftDetails[currentTokenID].salePrice = _price;
        nftDetails[currentTokenID].sold = false;
        emit nft_Created (currentTokenID, _tokenURI, msg.sender, address(this), _price, false); //emitting an event for the graph to track the nft Created
    }
    
    function nftSale(uint256 _tokenID) public payable{
      require(_exists(_tokenID), "Please select a valid token ID");
      require(nftDetails[_tokenID].salePrice<=msg.value, "Please pay the value of the NFT toke to buy it");
    
      //transfering ownership of the the token
      IERC721(address(this)).transferFrom(ownerOf(_tokenID), msg.sender, _tokenID);
      
      //Updating the nft Details
      require(balanceOf(msg.sender)!=0, "The token transfer was not succesful");
      payable(nftDetails[_tokenID].currentOwner).transfer(msg.value);
      nftDetails[_tokenID].currentOwner = msg.sender;
      nftDetails[_tokenID].sold = true;
      emit nft_Sale(_tokenID,msg.sender, nftDetails[_tokenID].sold); 
    }
    
    function contractBalance() public view returns(uint256){
      return( address(this).balance);
    }    
}
