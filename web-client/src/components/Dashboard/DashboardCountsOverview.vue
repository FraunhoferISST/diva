<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="12">
        <card class="pt-lg-16 px-lg-16">
          <template slot="body">
            <v-row>
              <v-col cols="12">
                <h4 class="dashboard-count-title">Entities</h4>
                <count-up class="dashboard-count" :end-val="allEntitiesCount" />
              </v-col>
            </v-row>
            <v-row class="dashboard-entities-count-container">
              <v-col
                cols="12"
                sm="12"
                md="6"
                lg="3"
                xl="4"
                v-for="entity in entitiesStats"
                :key="entity.entityType"
              >
                <colored-card>
                  <template slot="body">
                    <div class="d-flex justify-space-between">
                      <h4 class="dashboard-count-title" style="color: white">
                        {{ entity.entityType }}s
                      </h4>
                    </div>
                    <count-up
                      style="color: white"
                      class="dashboard-count"
                      :end-val="entity.count"
                    />
                  </template>
                </colored-card>
              </v-col>
            </v-row>
          </template>
        </card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Card from "@/components/Base/Card";
import ColoredCard from "@/components/Base/ColoredCard";
import CountUp from "vue-countup-v2";
export default {
  name: "DashboardCountsOverview",
  components: { ColoredCard, Card, CountUp },
  data: () => ({
    loading: true,
    entitiesDistribution: [
      {
        entityType: "resource",
        count: 0,
        percentage: 0,
      },
      {
        entityType: "asset",
        count: 0,
        percentage: 0,
      },
      {
        entityType: "user",
        count: 0,
        percentage: 0,
      },
      {
        entityType: "review",
        count: 0,
        percentage: 0,
      },
    ],
  }),
  computed: {
    entitiesStats() {
      return this.entitiesDistribution;
    },
    usersStats() {
      return this.entitiesDistribution.filter(
        ({ entityType }) => entityType === "user"
      );
    },
    allEntitiesCount() {
      return this.entitiesStats.length === 0
        ? 0
        : this.entitiesStats
            .map(({ count }) => count)
            .reduce((acc, value) => acc + value);
    },
    usersCount() {
      return this.usersStats.length === 0
        ? 0
        : this.usersStats
            .filter(({ entityType }) => entityType === "user")
            .map(({ count }) => count)
            .reduce((acc, value) => acc + value);
    },
  },
  mounted() {
    this.$api.analytics
      .distributionOfEntities()
      .then(({ data }) => {
        for (const stat of data) {
          const index = this.entitiesDistribution.findIndex(
            ({ entityType }) => entityType === stat.entityType
          );
          if (index < 0) {
            this.entitiesDistribution.push(stat);
          } else {
            this.entitiesDistribution.splice(index, 1, stat);
          }
        }
      })
      .finally(() => (this.loading = false));
  },
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
  // top: 90px;
}
</style>
