import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import DefaultLayout from "../../layout/DefaultLayout";

import { LayoutFeatures } from "../../components/LayoutFeatures";
import MainLayout from "../../components/MainLayout";
import DynamicPage from "../dynamic";
const pageData = require("../../../config/gettstarted/index.json");
export default function GetingStarted() {
  const { siteConfig } = useDocusaurusContext();

  return (
    // <Layout
    //   title={pageData.title || siteConfig.title}
    //   description={pageData.description || siteConfig.tagline}
    // >
    //    {pageData && pageData.blocks ? <LayoutFeatures route={pageData.route} blocks={pageData.blocks} /> : null}
    // </Layout>
    <DefaultLayout>
      <MainLayout>
        <DynamicPage/>
       {/* {pageData && pageData.blocks ? <LayoutFeatures route={pageData.route} blocks={pageData.blocks} /> : null} */}
      </MainLayout>
    </DefaultLayout>
  );
}
