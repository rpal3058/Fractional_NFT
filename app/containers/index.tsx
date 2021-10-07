import getWeb3 from "./web3"; // Web3 provider

// Global state provider
export default function GlobalProvider({ children }) {
  return <getWeb3.Provider>{children}</getWeb3.Provider>;
}

// Export individual containers
export { getWeb3 };