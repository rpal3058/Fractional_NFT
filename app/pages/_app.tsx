import 'tailwindcss/tailwind.css'
import GlobalProvider from "../containers";

function MyApp({ Component, pageProps }) {
  return(
    <GlobalProvider>
    <Component {...pageProps} />
    </GlobalProvider>
  ) 
}
export default MyApp
