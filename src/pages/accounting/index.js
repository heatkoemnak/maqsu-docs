// import React from "react";
// import Layout from "@theme/Layout";
// import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
// import { LayoutFeatures } from "../../components/LayoutFeatures";
// import DefaultLayout from "../../layout/DefaultLayout";
// const pageData = require("../../../config/accounting/index.json");
// console.log(pageData);

// export default function AccountingPage() {
//   const { siteConfig } = useDocusaurusContext();

//   return (
//     // <Layout
//     //   title={pageData && pageData.title ? pageData.title : siteConfig.title}
//     //   description={
//     //     pageData && pageData.description
//     //       ? pageData.description
//     //       : siteConfig.tagline
//     //   }
//     // >
//     //   {pageData && pageData.blocks ? <LayoutFeatures route={pageData.route} blocks={pageData.blocks} /> : null}
//     // </Layout>
//      <DefaultLayout>
//           {pageData && pageData.blocks ? <LayoutFeatures route={pageData.route} blocks={pageData.blocks} /> : null}
//         </DefaultLayout>
//   );
// }
import DefaultLayout from "../../layout/DefaultLayout";

import MainLayout from "../../components/MainLayout";
import DynamicPage from "../dynamic";
export default function Accounting() {

  return (

    <DefaultLayout>
      <MainLayout>
        <DynamicPage/>
      </MainLayout>
    </DefaultLayout>
  );
}
