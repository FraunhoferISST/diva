<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-alert text dense color="warning"> Under development </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DashboardRecentUsersActivities",
  components: {},
};
</script>

<style scoped lang="scss">
.dashboard-count {
  font-size: 4rem;
  font-weight: bolder;
  font-family: $font_header;
  color: $font_primary_color;
}
.dashboard-count-title {
  font-family: $font_body;
  letter-spacing: 0.07rem;
  display: block;
  font-size: 1.3rem;
  text-transform: capitalize;
  opacity: 0.9;
}
.dashboard-entities-count-container {
  position: relative;
  margin-top: -40px;
  top: 50px;
}

.dashboard-users-count-container {
  position: relative;
  top: 90px;
}
</style>
