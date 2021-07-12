<template>
  <section id="dashboard-overview" class="pa-lg-16">
    <dashboard-counts-overview />
    <dashboard-types-distribution-overview />
    <dashboard-recent-activities />
  </section>
</template>

<script>
import DashboardTypesDistributionOverview from "@/components/Dashboard/DashboardTypesDistributionOverview";
import DashboardRecentActivities from "@/components/Dashboard/DashboardRecentActivities/DashboardRecentActivities";
import DashboardCountsOverview from "@/components/Dashboard/DashboardCountsOverview";
export default {
  name: "DashboardOverview",
  components: {
    DashboardCountsOverview,
    DashboardRecentActivities,
    DashboardTypesDistributionOverview,
  },
};
</script>

<style scoped></style>
