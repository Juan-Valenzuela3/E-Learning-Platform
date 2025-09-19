import { Outlet } from "react-router-dom";
import TitleManager from "@/shared/components/TitleManager";
import { routeTitles } from "@/config/routeTitles";

const RootLayout = () => {
  return (
    <>
      <TitleManager
        routeTitles={routeTitles}
        defaultTitle="Donde el aprendizaje es una aventura"
        includeAppName={true}
        appName="EduPlatform"
      />
      <Outlet />
    </>
  );
};

export default RootLayout;
