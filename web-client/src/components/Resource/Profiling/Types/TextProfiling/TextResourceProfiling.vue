<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12">
        <custom-header text="Meta data" />
        <v-container fluid class="pa-0 pt-3">
          <meta-data :data="data" class="pt-2" :additional="specificMetaData" />
        </v-container>
      </v-col>
      <v-col cols="12">
        <custom-header text="Statistics" />
        <v-container fluid class="pa-0 pt-3">
          <v-row>
            <v-col
              cols="6"
              sm="3"
              class="pt-5"
              v-for="stat in statistics"
              :key="stat.title"
            >
              <info-block :title="stat.title" :value="stat.value" />
            </v-col>
            <v-col
              cols="12"
              class="pt-5"
              v-if="characterDistChartData.data.length > 0"
            >
              <chart-container>
                <line-chart
                  :data="characterDistChartData.data"
                  :labels="characterDistChartData.labels"
                />
              </chart-container>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-row>
          <v-col cols="12">
            <custom-header text="Core Phrases" />
          </v-col>
          <v-col cols="12">
            <core-phrases
              v-if="corePhrases.length > 0"
              :phrases="corePhrases"
            />
            <no-data-state v-else text="No Phrases extracted" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <custom-header text="Estimated personal data privacy" />
      </v-col>
      <v-col cols="12">
        <personal-data-evaluation
          :data="data.personalData"
          v-if="data.personalData"
        />
        <no-data-state v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CorePhrases from "@/components/Resource/Profiling/Types/TextProfiling/CorePhrases";
import LineChart from "@/components/Charts/LineChart";
import NoDataState from "@/components/Base/NoDataState";
import PersonalDataEvaluation from "@/components/Resource/Profiling/Common/PersonalDataEvaluation";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import MetaData from "@/components/Resource/Profiling/Common/MetaData";
import ChartContainer from "@/components/Charts/ChartContainer";
import CustomHeader from "@/components/Base/CustomHeader";

export default {
  name: "TextResourceProfiling",
  components: {
    CustomHeader,
    ChartContainer,
    MetaData,
    PersonalDataEvaluation,
    NoDataState,
    LineChart,
    CorePhrases,
    InfoBlock,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    active: 0,
  }),
  computed: {
    specificMetaData() {
      return [];
    },
    corePhrases() {
      return this.data.corePhrases ?? [];
    },
    statistics() {
      return [
        {
          title: "Number of sentences",
          value: this.data.numberOfSentences,
        },
        {
          title: "Number of words",
          value: this.data.numberOfWords,
        },
        {
          title: "Number of characters",
          value: this.data.numberOfCharacters,
        },
      ].map((data) => ({ ...data, value: data.value ?? "N/A" }));
    },
    characterDistChartData() {
      const stats = (this.data.characterDistribution ?? [])
        .slice()
        .sort(this.compareCharacterByCount);
      return {
        labels: stats.map((val) => val.character),
        data: stats.map((val) => val.count),
      };
    },
  },
  methods: {
    compareCharacterByCount: (a, b) => {
      let comparison = 0;
      if (b.count > a.count) {
        comparison = 1;
      } else if (b.count < a.count) {
        comparison = -1;
      }
      return comparison;
    },
  },
};
</script>

<style scoped lang="scss">
.chart-container > div {
  max-height: 120px;
}
</style>
