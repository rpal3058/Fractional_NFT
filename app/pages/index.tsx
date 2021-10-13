import { Fragment } from 'react';
import Head from 'next/head';
import Market from "../components/market/market"

export default function HomePage() {
    return (
        <Fragment>
         <Head>
           <title>NFT MARKET PLACE</title>
         </Head>
         <Market/>
        </Fragment>
    )
}