import DefaultLayout from "../../layout/DefaultLayout";
import MainLayout from "../../components/MainLayout";
import DynamicPage from "../dynamic";

export default function Compliance() {

  return (
    <DefaultLayout>
          <MainLayout>
            <DynamicPage slug="compliance" />
          </MainLayout>
        </DefaultLayout>
  );
}
