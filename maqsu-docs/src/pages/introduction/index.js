import DefaultLayout from "../../layout/DefaultLayout";
import MainLayout from "../../components/MainLayout";
import DynamicPage from "../dynamic";
export default function Introduction() {

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
