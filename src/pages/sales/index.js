import DefaultLayout from "../../layout/DefaultLayout";
import MainLayout from "../../components/MainLayout";
import DynamicPage from "../dynamic";

export default function SalesPage() {

  return (
    <DefaultLayout>
          <MainLayout>
            <DynamicPage slug="sales" />
          </MainLayout>
        </DefaultLayout>
  );
}
