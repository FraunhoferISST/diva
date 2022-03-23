<template>
  <v-container fluid>
    <v-row class="mt-6">
      <v-col cols="12" md="4">
        <card header="Entities type distribution in %">
          <data-viewer>
            <template>
              <chart-container v-if="distributionOfEntities.length > 0">
                <donut-chart
                  :labels="distributionOfEntitiesChartData.labels"
                  :data="distributionOfEntitiesChartData.data"
                />
              </chart-container>
              <no-data-state v-else />
            </template>
          </data-viewer>
        </card>
      </v-col>
      <v-col cols="12" md="4">
        <card header="Resource type distribution in %">
          <data-viewer
            slot="body"
            :fetch-method="fetchDistributionOfResourceTypes"
          >
            <template>
              <chart-container v-if="distributionOfResourceTypes.length > 0">
                <donut-chart
                  :labels="distributionOfResourceTypesChartData.labels"
                  :data="distributionOfResourceTypesChartData.data"
                />
              </chart-container>
              <no-data-state v-else />
            </template>
          </data-viewer>
        </card>
      </v-col>
      <v-col cols="12" md="4">
        <card header="Resource mime type distribution in %">
          <data-viewer
            slot="body"
            :fetch-method="fetchDistributionOfResourceMimeTypes"
          >
            <template>
              <chart-container
                v-if="distributionOfResourceMimeTypes.length > 0"
              >
                <donut-chart
                  :labels="distributionOfResourceMimeTypesChartData.labels"
                  :data="distributionOfResourceMimeTypesChartData.data"
                />
              </chart-container>
              <no-data-state v-else />
            </template>
          </data-viewer>
        </card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Card from "@/components/Base/Card";
import DonutChart from "@/components/Charts/DonutChart";
import NoDataState from "@/components/Base/NoDataState";
import ChartContainer from "@/components/Charts/ChartContainer";
import DataViewer from "@/components/DataFetchers/DataViewer";
export default {
  name: "DashboardTypesDistributionOverview",
  components: { DataViewer, ChartContainer, NoDataState, DonutChart, Card },
  data: () => ({
    distributionOfEntities: [],
    distributionOfResourceTypes: [],
    distributionOfResourceMimeTypes: [],
  }),
  computed: {
    distributionOfEntitiesChartData() {
      return {
        labels: this.distributionOfEntities.map(
          ({ entityType }) => `${this.capFirstCharacter(entityType)}s`
        ),
        data: this.distributionOfEntities.map(({ percentage }) =>
          (percentage * 100).toFixed(2)
        ),
      };
    },
    distributionOfResourceTypesChartData() {
      return {
        labels: this.distributionOfResourceTypes.map(
          ({ resourceType }) => `${this.capFirstCharacter(resourceType)}`
        ),
        data: this.distributionOfResourceTypes.map(({ percentage }) =>
          (percentage * 100).toFixed(2)
        ),
      };
    },
    distributionOfResourceMimeTypesChartData() {
      return {
        labels: this.distributionOfResourceMimeTypes.map(
          ({ mimeType }) => `${this.capFirstCharacter(mimeType)}`
        ),
        data: this.distributionOfResourceMimeTypes.map(({ percentage }) =>
          (percentage * 100).toFixed(2)
        ),
      };
    },
  },
  methods: {
    capFirstCharacter(string) {
      return `${string[0].toUpperCase()}${string.slice(1)}`;
    },
    fetchDistributionOfEntities() {
      return this.$api.analytics
        .distributionOfEntities()
        .then(({ data }) => (this.distributionOfEntities = data));
    },
    fetchDistributionOfResourceTypes() {
      return this.$api.analytics
        .distributionOfResourceTypes()
        .then(({ data }) => (this.distributionOfResourceTypes = data));
    },
    fetchDistributionOfResourceMimeTypes() {
      return this.$api.analytics
        .distributionOfResourceMimeTypes()
        .then(({ data }) => (this.distributionOfResourceMimeTypes = data));
    },
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
  top: 90px;
}
</style>
