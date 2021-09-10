import { ethers } from "hardhat";

async function main() {
  //Deploying market
  const market = await ethers.getContractFactory("nftMarket");
  let instanceOfMarket = await market.deploy();  
  console.log(
      `The address the market contract WILL have once mined: ${instanceOfMarket.address}`
  );
  console.log(
      `The transaction that was sent to the network to deploy the market contract: ${
          instanceOfMarket.deployTransaction.hash
      }`
  );
  console.log(
      'The market contract is NOT deployed yet; we must wait until it is mined...'
  );
  await instanceOfMarket.deployed();
  console.log('Mined!');
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
