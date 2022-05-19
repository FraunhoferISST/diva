import DestroyPhase from "@/views/DestroyPhase/DestroyPhase";
import DashboardOverview from "@/views/DestroyPhase/DestroyPhaseOverview";

export default {
  component: DestroyPhase,
  path: "destroy-phase",
  name: "Destroy Phase",
  redirect: {
    name: "destroy_phase_overview",
  },
  children: [
    {
      component: DashboardOverview,
      path: "overview",
      name: "destroy_phase_overview",
    },
  ],
};
