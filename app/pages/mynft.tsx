import { Fragment } from 'react';
import Head from 'next/head';
import MyNft from "../components/mynft/mynft"

export default function HomePage() {
 return (
  <Fragment>
    <Head>
     <title>MY NFT</title>
    </Head>
    <MyNft/>
  </Fragment>
 )
}