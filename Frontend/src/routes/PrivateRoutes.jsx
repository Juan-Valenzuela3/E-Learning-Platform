//import { lazy } from "react";
import AppLayout from "@/components/layout/AppLayout";

//const Dashboard = lazy(() => import("@/pages/Dashboard"));
//const Profile = lazy(() => import("@/pages/Profile"));

const privateRoutes = [
  {
    path: "/dashboard",
    element: (
      <AppLayout>
        {/*<Dashboard />*/}
      </AppLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <AppLayout>
         {/*<Profile />*/}
      </AppLayout>
    ),
  },
];

export default privateRoutes;
