import Navbar from '../components/Navbar/Navbar'


export default function DefaultLayout({children}) {
  return (
    <div style={{backgroundColor: 'transparent'}}>
        <Navbar/>
        {children}
        {/* <Footer/> */}
    </div>
  )
}
