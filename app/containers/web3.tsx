import Moralis from 'moralis';
import {useState, useEffect} from "react"
import {ethers} from "ethers"; // Ethers
import {NftMarket__factory} from "../typechain";
import { createContainer } from "unstated-next"; // Unstated-next containerization

// Application id from moralis.io
Moralis.initialize(process.env.NEXT_PUBLIC_MORALIS_ID)
//Server url from moralis.io
Moralis.serverURL = process.env.NEXT_PUBLIC_MORALIS_SERVER;

function useWeb3 (){
    let temp
    let user
    let _web3    
    const [address, setAddress] = useState("");
    const [web3, setWeb3] = useState(null);
    const [nft, setNft] = useState(null);

    // Getting the current address of the metamask
    async function login() {        
        try{
            //Setting the user address
            let user = Moralis.User.current();
            if (!temp) {
                try{
                    user = await Moralis.Web3.authenticate()
                    _web3 = await Moralis.Web3.enable()
                }catch{
                    user = await Moralis.Web3.authenticate({ provider: "walletconnect"})
                    _web3 = await Moralis.Web3.enable({ provider: "walletconnect"})
                }
            }   

            //capturing the address of the connected account 
            console.log("logged in user address:" + user.attributes.accounts.toString()) 
            setAddress(user.attributes.accounts.toString())

            //capturing the Web3
            console.log("Web3 connected : ") 
            console.log(_web3)
            setWeb3(_web3)

        } catch(error){
            console.log('Connections failed', error);
        }
    }

    //accessing NFT Market instance
    useEffect(()=>{
        async function getContractInstance(){
            try{
                if(web3){
                const nftMarket = process.env.NEXT_PUBLIC_ADDRESS_RINKEBY
                console.log(nftMarket)
                temp = new web3.eth.Contract(NftMarket__factory.abi,nftMarket)
                console.log("NFT market contract accessed : ")
                console.log(temp)
                setNft(temp)
                }
            }catch(error){
                console.log("Couldnt get the contract. Check if it connected to a provider ")
            }
        }
        getContractInstance()
    },[web3])

    async function logout() {
        try {
          console.log('logged Out')  
          await Moralis.User.logOut()
          setWeb3("")
          setAddress("")
        } catch (error) {
          console.log('logOut failed', error);
        }
    }
    return {login,logout, address,web3, nft, }
}

//create container 
const getWeb3 = createContainer(useWeb3)
export default getWeb3