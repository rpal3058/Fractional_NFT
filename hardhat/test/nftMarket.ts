/*
NOTE: THE TEST FILE RUNS OFN DEFAULT HARDHAT NETWORK AND DOESNT NEED GANACHE OR MAINNET OR TESTNET
IF YOU WANT TO USE GANCHE THE TYPE - npx hardhat --network localhost test 
*/  
import {NftMarket__factory} from "../typechain"
import { ethers} from "hardhat"
import chai from "chai"

//Handling Promises 
import chaiAsPromised from "chai-as-promised"
chai.use(chaiAsPromised)

const { expect } = chai


let instanceOfMarket: any
let instanceOfNFT: any
let signers: any 

describe("NFT Market", () => {
  beforeEach(async () => {  
    // 1 
    signers = await ethers.getSigners()

    // 2: Deploying a market contract to manage the NFT contract
    const market = await ethers.getContractFactory("nftMarket",signers[0])
    instanceOfMarket = await market.deploy() //UPDATE THIS if the constructor as any input
    await instanceOfMarket.deployed()
  });

  // 3
  //UPDATE THE TEST CASES
  it("should check if the contract has been deployed", async function(){
    //Testing if the market and NFT has been deployed
     expect(instanceOfMarket.address).to.not.be.undefined
     expect(instanceOfMarket.name()).to.eventually.be.equal("myNFT")
     expect(instanceOfMarket.symbol()).to.eventually.be.equal("NFT")
  });
  
  it("should check to see if token can being created when msg.value is less than .025(i.e listing price)", async function(){    
    let listingValue = ethers.utils.parseEther(".001") //testing with value less than the listing value //converting ether to Wei format 
    let buyValue = ethers.utils.parseEther(".1") //converting ether to Wei format
    //Inlcude the nftCreate in the expect statement then the error will not be triggered before expect statement 
    await expect(instanceOfMarket.connect(signers[1]).nftCreate("testing", buyValue, { value: listingValue }))
    .to.rejectedWith("Exception while processing transaction: revert Please pay the listing price")
  });

  it("should check to see if token is being created", async function(){

    let listingValue = ethers.utils.parseEther(".025") //converting ether to Wei format
    let buyValue = ethers.utils.parseEther(".1") //converting ether to Wei format
    await instanceOfMarket.connect(signers[1]).nftCreate("testing", buyValue, { value: listingValue })
   
    let tx = await instanceOfMarket.nftDetails(1)
    expect(instanceOfMarket.ownerOf(1)).to.eventually.be.equal(tx.creator)
    expect(instanceOfMarket.ownerOf(1)).to.eventually.be.equal(tx.currentOwner)
    expect(tx.salePrice).to.be.equal(buyValue)
    expect(tx.sold).to.be.equal(false)
  });  

  it("should check to see if token is being sold when the tokenID and msg.value is incorrect", async function(){

    let listingValue = ethers.utils.parseEther(".025") //converting ether to Wei format
    let buyValue = ethers.utils.parseEther(".1") //converting ether to Wei format
    await instanceOfMarket.connect(signers[1]).nftCreate("testing", buyValue, { value: listingValue })

    //Testing when the tokenID is wrong
    let _msgValue = ethers.utils.parseEther(".1") //value is equal to the one stated during creation of the token //converting ether to Wei format  
    await expect(instanceOfMarket.nftSale(2, { value: _msgValue }))
    .to.rejectedWith("Exception while processing transaction: revert Please select a valid token ID")

    //Testing when the value sent is less the required price
    _msgValue = ethers.utils.parseEther(".01") //converting ether to Wei format
    await expect(instanceOfMarket.nftSale(1, { value: _msgValue }))
    .to.rejectedWith("Exception while processing transaction: revert Please pay the value of the NFT toke to buy it")
  });

  it("should check to see if token is being sold", async function(){
  
    let listingValue = ethers.utils.parseEther(".025") 
    let buyValue = ethers.utils.parseEther(".1") 
    await instanceOfMarket.connect(signers[1]).nftCreate("testing", buyValue, { value: listingValue })

    let _msgValue = ethers.utils.parseEther(".1") //value is equal to the one stated during creation of the token 
    await instanceOfMarket.nftSale(1, { value: _msgValue })
    
    let tx = await instanceOfMarket.nftDetails(1)
    expect(instanceOfMarket.ownerOf(1)).to.eventually.be.not.equal(tx.creator)
    expect(instanceOfMarket.ownerOf(1)).to.eventually.be.equal(tx.currentOwner)
    expect(tx.salePrice).to.be.equal(buyValue)
    expect(tx.sold).to.be.equal(true)
  });

  it("should check to see if money is properly being updated", async function(){
    let listingValue = ethers.utils.parseEther(".025") //converting ether to Wei format
    let buyValue = ethers.utils.parseEther(".1") //converting ether to Wei format
    await instanceOfMarket.connect(signers[1]).nftCreate("testing", buyValue, { value: listingValue })

    //testing if the contract is getting the listing price
    let contractBalance = await instanceOfMarket.contractBalance()
    expect(contractBalance.toString()).to.be.equal(listingValue)

    //getting the balance of the creator and the owner BEFORE the transaction 
    let prov = ethers.provider
    let creatorBalance =  await prov.getBalance(signers[1].address)
    let newOwnerBalance = await prov.getBalance(signers[2].address)
    //converting ether to Wei format
    let _msgValue = ethers.utils.parseEther(".1") //value is equal to the one stated during creation of the token 
    await instanceOfMarket.connect(signers[2]).nftSale(1, { value: _msgValue })

    //getting the balance of the creator and the owner AFTER the transaction 
    let updatedCreatorBalance =  await prov.getBalance(signers[1].address)
    let updatedNewOwnerBalance = await prov.getBalance(signers[2].address)

    //testing the contract balance after the sale    
    contractBalance = await instanceOfMarket.contractBalance()
    expect(contractBalance.toString()).to.be.equal(listingValue)

    //testing balance of the CHANGE of creator after the sale
    //refer https://docs.ethers.io/v5/api/utils/bignumber/#BigNumber--methods
    let diff = updatedCreatorBalance.sub(creatorBalance)
    expect(diff).to.be.equal(_msgValue)

    // //testing balance of the CHANGE of new owner after the sale
    //https://docs.ethers.io/v5/api/utils/bignumber/#BigNumber--methods
     diff = newOwnerBalance.sub(updatedNewOwnerBalance)
     let temp = diff.div(ethers.utils.parseEther(".01")) //converting to a whole number for comparison
     expect(temp.toNumber()).to.be.within(10,11)// Since there will be some difference due to the gas fees hence putting a range
  });

  it("should check to see if token is properly being updated", async function(){
    let listingValue = ethers.utils.parseEther(".025") //converting ether to Wei format
    let buyValue = ethers.utils.parseEther(".1") //converting ether to Wei format
    await instanceOfMarket.connect(signers[1]).nftCreate("testing", buyValue, { value: listingValue })

    let _msgValue = ethers.utils.parseEther(".1") //value is equal to the one stated during creation of the token 
    await instanceOfMarket.connect(signers[2]).nftSale(1, { value: _msgValue })

    expect(instanceOfMarket.balanceOf(signers[1].address)).to.be.eventually.equal(0)
    expect(instanceOfMarket.balanceOf(signers[2].address)).to.be.eventually.equal(1)
  });

})