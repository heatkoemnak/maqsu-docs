import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { LayoutFeatures } from "../../components/LayoutFeatures";
const pageData = require("../../../config/accounting/index.json");
console.log(pageData);

export default function AccountingPage() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={pageData && pageData.title ? pageData.title : siteConfig.title}
      description={
        pageData && pageData.description
          ? pageData.description
          : siteConfig.tagline
      }
    >
      {pageData && pageData.blocks ? <LayoutFeatures route={pageData.route} blocks={pageData.blocks} /> : null}
    </Layout>
  );
}
