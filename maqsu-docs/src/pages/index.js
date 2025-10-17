import React from "react";
import Layout from "@theme/Layout";
import { Blocks } from "../components/Blocks";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useLocation } from "@docusaurus/router";
const pageData = require("../../config/homepage/index.json");

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  // const location = useLocation();
  // console.log(location.pathname);
  // const [posts, setPosts] = React.useState(null);
  // console.log(posts);

  // React.useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const result = await client.queries.pages({
  //         relativePath: "sales/orders/quotations.mdx",
  //       });
  //       // Wrap post into an array to safely map later
  //       const postsArray = result?.data?.pages ? [result.data.pages] : [];
  //       setPosts(postsArray);
  //     } catch (err) {
  //       console.error("Error fetching Tina data:", err);
  //     }
  //   }
  //   fetchData();
  // }, []);
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
      {pageData?.blocks && <Blocks blocks={pageData.blocks} />}
    {/*
      <div className="container margin-vert--lg">
        <h2>Posts</h2>
        {!posts ? (
          <p>Loading...</p>
        ) : (
          <ul className="list-group">
            {posts.map((post, i) => (
              <li key={i} className="list-group-item">
                <h3>{post.title}</h3>
                <TinaMarkdown content={post.body} />
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </Layout>
  );
}
