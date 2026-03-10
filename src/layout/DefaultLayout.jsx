import { useState, useEffect } from 'react'
import { client } from '../../tina/__generated__/client'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'


export default function DefaultLayout({children}) {
    const [posts, setPosts] = useState([])
  console.log("posts:", posts)
    const [active, setActive] = useState(null)

    async function fetchData() {
                  try {
                      const result = await client.queries.categories({
                                relativePath: "getting-started.mdx",
                              });
                              const postsArray = result?.data;

                      setPosts(postsArray);
                  } catch (err) {
                      console.error("Error fetching Tina data:", err);
                  }
              }
    useEffect(() => {
      fetchData();
    }, [])
  return (
    <div style={{backgroundColor: 'transparent'}}>
        <Navbar/>
        {children}
        {/* <Footer/> */}
    </div>
  )
}
