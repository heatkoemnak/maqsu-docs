import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";
const pageData = require("../../config/homepage/index.json");
import styles from "./styles.module.css";
import HomeContent from "../components/HomeContent";

console.log(pageData);

export default function Home() {
  const { siteConfig } = useDocusaurusContext();


  React.useEffect(() => {
    (function (d, t) {
      var BASE_URL="https://app.chatwoot.com";
      var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
      g.src=BASE_URL+"/packs/js/sdk.js";
      g.async = true;
      s.parentNode.insertBefore(g,s);
      g.onload=function(){
        window.chatwootSDK.run({
          websiteToken: 'Nn92Qfh3a9Pvd46kzXoWuCqQ',
          baseUrl: BASE_URL
        })
      }
    })(document,"script");
  }, []);

  return (
    <Layout
      title={pageData?.title || siteConfig.title}
      description={pageData?.description || siteConfig.tagline}
    >
      {/* {pageData?.blocks && <Blocks blocks={pageData.blocks} />} */}
      <div className={clsx(styles.layout)}>
       <HomeContent cardList={pageData.blocks[1].items}/>
      </div>
    </Layout>
  );
}
