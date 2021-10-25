import { Fragment } from 'react';
import Head from 'next/head';
import SearchResult from '../components/searchResults/index';

function Search() {
  return (
    <Fragment>
      <Head>
        <title>Search Results</title>
      </Head>
      <SearchResult/>
    </Fragment>
  );
}

export default Search;