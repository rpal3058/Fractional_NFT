import {ethers} from "ethers"; // Ethers
import {useRouter } from "next/router";
import {useEffect, useState } from "react";
import { Container } from "unstated-next";
import  Header from "../../components/header";
import Layout from "../../components/layout";
import { web3 } from "../../containers";

export default function Home() { 
const router = useRouter()



  return(
    <div className="bg-blue-500 w-screen h-screen">
      <Layout>
        <div className="flex flex-col justify-center items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-4 lg:space-x-8 max-w-6xl w-11/12 mx-auto">
          <div className="w-full md:w-1/2 max-w-md border border-palette-lighter bg-white rounded shadow-lg">
            <div className="relative h-96">
            </div>
          </div> 
        </div>
      </Layout>
    </div>
  )
  
}