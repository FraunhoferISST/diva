import Dashboard from "@/views/Dashboard/Dashboard";
import DashboardOverview from "@/views/Dashboard/DashboardOverview";
import DashboardResources from "@/views/Dashboard/DashboardResources";
import DashboardAssets from "@/views/Dashboard/DashboardAssets";

export default {
  component: Dashboard,
  path: "dashboard",
  name: "dashboard",
  redirect: {
    name: "dashboard_overview",
  },
  children: [
    {
      component: DashboardOverview,
      path: "overview",
      name: "dashboard_overview",
    },
    {
      component: DashboardResources,
      path: "resources",
      name: "dashboard_resources",
    },
    {
      component: DashboardAssets,
      path: "assets",
      name: "dashboard_assets",
    },
  ],
};
