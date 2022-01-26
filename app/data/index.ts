import { GraphQLClient } from "graphql-request"; // GraphQL request client

let url = "https://api.studio.thegraph.com/query/4554/nft_market_rinkeby/4"

// const API_KEY = process.env.NEXT_PUBLIC_GRAPH_API
// //When the graph is live
// let url = "https://gateway.testnet.thegraph.com/api/API_KEY/subgraphs/id/0x44f003aa59adc6122f46e8eb170b268fa0803dbe-0";

// Create client
const client = new GraphQLClient(url);

// Export client
export default client;