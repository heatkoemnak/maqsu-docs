import React,{useEffect,useState} from 'react';
import { client } from "../../tina/__generated__/client";
import { useLocation } from '@docusaurus/router';
import MainLayout from '@site/src/components/MainLayout';
import Link from '@docusaurus/Link';
import { FeatureSections } from '../components/LayoutFeatures/FeatureSection';
import { LayoutFeatures } from '../components/LayoutFeatures';
import Topics from '../components/Topics';
const pageData = require("../../config/gettstarted");
export default function DynamicPage() {
  const location = useLocation();
  const slug = location.pathname
  console.log(slug);
  const [posts, setPosts] = useState(null);
  console.log(posts);
  useEffect(() => {
      async function fetchData() {
        try {
          const result = await client.queries.categories({
            relativePath: `${slug}.mdx`,
          });

          const sections =
            result?.data?.categories|| [];

          setPosts(sections || []);
        } catch (err) {
          console.error("Error fetching Tina data:", err);
        }
      }

      fetchData();
    }, []);
  return (
    <>
      <Topics topics={posts}/>
      {/* <LayoutFeatures blocks={pageData?.blocks} categories={posts} /> */}
    </>
  );
}
