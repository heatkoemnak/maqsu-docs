import React from "react";
import HomeContent from "../components/HomeContent";
import DefaultLayout from "../layout/DefaultLayout";
import Footer from "../components/Footer";
import { BookProvider } from "../context/BookProvider";
const pageData = require("../../config/homepage/index.json");

export default function Home() {


  // React.useEffect(() => {

  //   (function (d, t) {
  //     var BASE_URL="https://app.chatwoot.com";
  //     var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
  //     g.src=BASE_URL+"/packs/js/sdk.js";
  //     g.async = true;
  //     s.parentNode.insertBefore(g,s);
  //     g.onload=function(){
  //       window.chatwootSDK.run({
  //         websiteToken: 'Nn92Qfh3a9Pvd46kzXoWuCqQ',
  //         baseUrl: BASE_URL
  //       })
  //     }
  //   })(document,"script");
  // }, []);

  return (
    <BookProvider>
    <DefaultLayout>
       <HomeContent cardList={pageData.blocks[1].items}/>
      <Footer/>
    </DefaultLayout>
    </BookProvider>
  );
}
