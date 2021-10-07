import getSidebar from "./sidebar"; // Sidebar

// Global state provider
export default function GlobalProvider({ children }) {
  return <getSidebar.Provider>{children}</getSidebar.Provider>;
}

// Export individual containers
export { getSidebar };