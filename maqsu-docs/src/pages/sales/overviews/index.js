import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { LayoutContents } from "../../../components/LayoutContents";
const pageData = require("../../../../config/sales/index.json");
console.log(pageData);

export default function QuotationsPage() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={pageData && pageData.title ? pageData.title : siteConfig.title}
      description={pageData && pageData.description
          ? pageData.description
          : siteConfig.tagline
      }
    >
      {pageData && pageData.blocks ? <LayoutContents route={pageData.route} blocks={pageData.blocks} /> : null}
    </Layout>
  );
}
