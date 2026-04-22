import DefaultLayout from "../../layout/DefaultLayout";
import MainLayout from "../../components/MainLayout";
import DynamicPage from "../dynamic";
export default function GetingStarted() {

  return (
    <DefaultLayout>
      <MainLayout>
        <DynamicPage slug="getting-started" />
      </MainLayout>
    </DefaultLayout>
  );
}
