import 'tailwindcss/tailwind.css'
import GlobalProvider from "../containers";
import Layout from '../components/layout/layout';

function MyApp({ Component, pageProps }) {
  return(
    
    <GlobalProvider>
     <Layout> 
    <Component {...pageProps} />
    </Layout>
    </GlobalProvider>
    
  ) 
}
export default MyApp
