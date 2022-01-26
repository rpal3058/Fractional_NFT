import {useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal"; // Web3Modal
import { ethers, providers } from "ethers"; // Ethers
import { createContainer } from "unstated-next"; // Unstated-next containerization
import {} from "../typechain";
import WalletConnectProvider from "@walletconnect/web3-provider"; // WalletConnectProvider (Web3Modal)

// Web3Modal provider options
let modal;

// Set web3Modal
if (typeof window !== 'undefined') {
  modal = new Web3Modal({
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: { infuraId: process.env.NEXT_PUBLIC_INFURA_ID },
      },
    },
  });
}

function useWeb3() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);
  const [provider, setProvider] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [factory, setFactory] = useState(null);
  const [contract, setContract] = useState(null);

  // Authenticate and store necessary items in global state
  const connect = useCallback(async () => {
    
    setLoading(true);
    
    try {
      const provider = await modal.connect()
      const account = provider.selectedAddress 
      if (!account) throw new Error(`Unable to find selected account.`);
      setAccount(account);
      setProvider(provider);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

    //accessing FACTORY instance
    // const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
    // const kbFactory = ______________.connect(factoryAddress, signer); //UPDATE THE FACTORY CONTRACT NAME AS PER TYPECHAIN
    // setKanbanFactory(kbFactory);

    //accessing CONTRACT instance
    //      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    //      const contract = ____________.connect(contractAddress, signer) //UPDATE THE FACTORY CONTRACT NAME AS PER TYPECHAIN
    //      console.log("Kanban accessed : " + contract)
    //      setContract(contract)  
  },[])

  const disconnect = useCallback(async() =>{
    await modal.clearCachedProvider();
    setAccount(null);
    setProvider(null);
  },[])

  return { connect, disconnect,  provider,account, contract, factory };
}

// Create unstate-next container
const web3 = createContainer(useWeb3);
export default web3;