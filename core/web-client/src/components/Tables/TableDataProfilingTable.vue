<template>
  <div>
    <v-row>
      <v-col class="pt-4" cols="12" sm="12" md="6">
        <profiling-table-autocomplete
          :columns="columns"
          @selected="columnSelected"
        />
      </v-col>
    </v-row>
    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="filteredColumns"
        item-key="title"
        :items-per-page="10"
        no-data-text="N/A"
        no-results-text="No columns found"
        show-expand
        single-expand
      >
        <template #item.dataType="{ item }">
          <v-chip
            small
            text-color="white"
            :color="dataTypeChipColor(item.dataType)"
          >
            {{ item.dataType }}
          </v-chip>
        </template>
        <template #item.completeness="{ item }">
          <table-progress-circle :progress="item.completeness" />
        </template>
        <template #item.typeCorrectness="{ item }">
          <table-progress-circle :progress="item.typeCorrectness" />
        </template>
        <template #expanded-item="{ item, headers }">
          <td class="pa-0" :colspan="headers.length">
            <v-container fluid class="full-width pt-0">
              <v-row dense>
                <v-col cols="12" sm="6" md="8">
                  <card>
                    <div class="chart-container" slot="body">
                      <sub-header text="Numbers Frequency" class="mb-3" />
                      <line-chart
                        v-if="
                          item.frequencyNumbers &&
                          item.frequencyNumbers.length > 0
                        "
                        :labels="
                          frequencyChartData(
                            item.frequencyNumbers,
                            item.dataType
                          ).labels
                        "
                        :data="
                          frequencyChartData(
                            item.frequencyNumbers,
                            item.dataType
                          ).data
                        "
                      />
                      <no-data-state v-else slot="body" />
                    </div>
                  </card>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <card>
                    <div class="chart-container" slot="body">
                      <sub-header class="mb-3" text="Data Types Distribution" />
                      <donut-chart
                        v-if="item.numberOfNumbers || item.numberOfStrings"
                        :labels="typeDistributionChartData(item).labels"
                        :data="typeDistributionChartData(item).data"
                      />
                      <no-data-state v-else slot="body" />
                    </div>
                  </card>
                </v-col>
                <v-col cols="12" sm="6" md="8">
                  <card>
                    <div class="chart-container" slot="body">
                      <sub-header class="mb-3" text="Strings Frequency" />
                      <line-chart
                        v-if="
                          item.frequencyStrings &&
                          item.frequencyStrings.length > 0
                        "
                        :labels="
                          frequencyChartData(
                            item.frequencyStrings,
                            item.dataType
                          ).labels
                        "
                        :data="
                          frequencyChartData(
                            item.frequencyStrings,
                            item.dataType
                          ).data
                        "
                      />
                      <no-data-state v-else slot="body" />
                    </div>
                  </card>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <card>
                    <div class="chart-container" slot="body">
                      <sub-header class="mb-3" text="Rows Completeness" />
                      <pie-chart
                        :labels="rowsCompletenessChartData(item).labels"
                        :data="rowsCompletenessChartData(item).data"
                      />
                    </div>
                  </card>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" md="3">
                  <card>
                    <div class="chart-container" slot="body">
                      <sub-header class="mb-3" text="Quantile" />
                      <bar-chart
                        :sickness="0.6"
                        v-if="
                          item.quantileQ1 || item.quantileQ2 || item.quantileQ3
                        "
                        :labels="quantileChartData(item).labels"
                        :data="quantileChartData(item).data"
                      />
                      <no-data-state v-else slot="body" />
                    </div>
                  </card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <card>
                    <div class="chart-container" slot="body">
                      <sub-header class="mb-3" text="Sum Statistics" />
                      <bar-chart
                        :sickness="0.6"
                        v-if="
                          item.sum || item.sumSquared || item.sumSquaredError
                        "
                        :labels="sumChartData(item).labels"
                        :data="sumChartData(item).data"
                      />
                      <no-data-state v-else slot="body" />
                    </div>
                  </card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <card>
                    <div class="chart-container" slot="body">
                      <sub-header class="mb-3" text="Min and Max Values" />
                      <horizontal-bar-chart
                        :sickness="0.6"
                        v-if="item.minValue || item.median || item.maxValue"
                        :labels="minMaxValuesChartData(item).labels"
                        :data="minMaxValuesChartData(item).data"
                      />
                      <no-data-state v-else />
                    </div>
                  </card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <card>
                    <div class="chart-container" slot="body">
                      <sub-header
                        class="mb-3"
                        text="Min and Max Character length"
                      />
                      <horizontal-bar-chart
                        :sickness="0.6"
                        v-if="item.minCharLength || item.maxCharLength"
                        :labels="minMaxCharacterLengthChartData(item).labels"
                        :data="minMaxCharacterLengthChartData(item).data"
                      />
                      <no-data-state v-else slot="body" />
                    </div>
                  </card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <card>
                    <div class="chart-container" slot="body">
                      <sub-header class="mb-3" text="Mean Values" />
                      <horizontal-bar-chart
                        :sickness="0.6"
                        v-if="
                          item.mean ||
                          item.meanSquaredError ||
                          item.meanDeviation
                        "
                        :labels="meanValuesChartData(item).labels"
                        :data="meanValuesChartData(item).data"
                      />
                      <no-data-state v-else slot="body" />
                    </div>
                  </card>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col
                  cols="12"
                  sm="12"
                  v-if="simpleStatistics(item).length > 0"
                >
                  <card>
                    <v-container slot="body" class="pa-0" fluid>
                      <v-row>
                        <v-col
                          class="pb-3"
                          cols="12"
                          sm="6"
                          md="4"
                          v-for="(stat, key) in simpleStatistics(item)"
                          :key="key"
                        >
                          <info-block :title="stat.title" :value="stat.value" />
                        </v-col>
                      </v-row>
                    </v-container>
                  </card>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import BarChart from "@/components/Charts/BarChart";
import LineChart from "@/components/Charts/LineChart";
import DonutChart from "@/components/Charts/DonutChart";
import HorizontalBarChart from "@/components/Charts/HorizontalBarChart";
import PieChart from "@/components/Charts/PieChart";
import Card from "@/components/Base/Card";
import vars from "@/styles/vars.scss";
import getStats from "@/components/Tables/TablesHelperComponets/simpleStats";
import ProfilingTableAutocomplete from "@/components/Tables/TablesHelperComponets/ProfilingTableAutocomplete";
import CircleProgressOptionsMixin from "@/components/Base/CircleProgressOptionsMixin";
import NoDataState from "@/components/Base/NoDataState";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import TableProgressCircle from "@/components/Tables/TablesHelperComponets/TableProgressCircle";
import SubHeader from "@/components/Base/SubHeader";

export default {
  name: "TableDataProfilingTable",
  components: {
    SubHeader,
    TableProgressCircle,
    InfoBlock,
    NoDataState,
    ProfilingTableAutocomplete,
    Card,
    PieChart,
    HorizontalBarChart,
    DonutChart,
    LineChart,
    BarChart,
  },
  mixins: [CircleProgressOptionsMixin],
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: "Name", value: "title" },
      { text: "Type", value: "dataType" },
      { text: "Type correctness %", value: "typeCorrectness" },
      { text: "Completeness %", value: "completeness" },
      { text: "Rows", value: "maxNumberOfRows" },
      { text: "Column index", value: "columnIndex" },
    ],
    expanded: [],
    selectedColumns: [],
  }),
  computed: {
    formattedColumns() {
      return this.columns.map((col) => ({
        ...col,
        completeness: this.columnCompletenessPercentage(col),
        typeCorrectness: this.columnTypeCorrectnessPercentage(col),
      }));
    },
    filteredColumns() {
      if (this.selectedColumns.length > 0) {
        return this.formattedColumns.filter((col) =>
          this.selectedColumns.includes(col.id)
        );
      }
      return this.formattedColumns;
    },
  },
  methods: {
    percent(value) {
      return parseFloat(value).toFixed(2) * 100;
    },
    columnSelected(columns) {
      this.selectedColumns = columns;
    },
    dataTypeChipColor(type) {
      return type.toLowerCase() === "number"
        ? vars.accentPrimary
        : vars.accentSecondary;
    },
    columnCompletenessPercentage(col) {
      if (col.numberOfNullElements === 0) {
        return 100;
      }
      return (
        100 -
        parseFloat(
          ((col.numberOfNullElements * 100) / col.numberOfRows).toFixed(2)
        )
      );
    },
    columnTypeCorrectnessPercentage(col) {
      let errorRows =
        col.dataType === "number"
          ? col.numberOfStrings ?? 0
          : col.numberOfNumbers ?? 0;
      let correctRows = col.numberOfNumbers ?? col.numberOfStrings ?? 0;
      let maxRows = col.maxNumberOfRows;

      if (errorRows === 0) {
        return 100;
      }
      if (correctRows === 0) {
        return 0;
      }
      return (
        maxRows && 100 - parseFloat(((errorRows * 100) / maxRows).toFixed(2))
      );
    },

    typeDistributionChartData: (item) => ({
      labels: ["Numbers", "Strings"],
      data: [item.numberOfNumbers || 0, item.numberOfStrings || 0],
    }),
    rowsCompletenessChartData: (item) => ({
      labels: ["Rows", "Complete", "Empty"],
      data: [
        item.maxNumberOfRows,
        item.numberOfRows,
        item.maxNumberOfRows - item.numberOfRows,
      ],
    }),
    quantileChartData: (item) => ({
      labels: ["Q1", "Q2", "Q3"],
      data: [item.quantileQ1 || 0, item.quantileQ2 || 0, item.quantileQ3 || 0],
    }),
    sumChartData: (item) => ({
      labels: ["Sum", "Sum Sqrt.", "Sum Sqrt. Error"],
      data: [item.sum, item.sumSquared, item.sumSquaredError],
    }),
    minMaxCharacterLengthChartData: (item) => ({
      labels: ["Min", "Max"],
      data: [item.minCharLength, item.maxCharLength],
    }),
    minMaxValuesChartData: (item) => ({
      labels: ["Min", "Median", "Max"],
      data: [item.minValue, item.median, item.maxValue],
    }),
    meanValuesChartData: (item) => ({
      labels: ["Mean", "Mean Sqrt. Error", "Mean Deviation"],
      data: [item.mean, item.meanSquaredError, item.meanDeviation],
    }),
    frequencyChartData(freq, type) {
      const frequencies =
        type.toLowerCase() === "string"
          ? this.sortStrings(freq)
          : this.sortNumbers(freq);
      return {
        labels: frequencies.map((val) => val.token),
        data: frequencies.map((val) => val.count),
      };
    },
    sortNumbers: (freq) => {
      return [...freq].sort((val_1, val_2) => {
        if (val_1.token < val_2.token) {
          return -1;
        }
        if (val_1.token > val_2.token) {
          return 1;
        }
        return 0;
      });
    },
    sortStrings: (freq) => {
      return [...freq].sort((val_1, val_2) => {
        if (val_1.count < val_2.count) {
          return -1;
        }
        if (val_1.count > val_2.count) {
          return 1;
        }
        return 0;
      });
    },
    simpleStatistics(item) {
      return getStats(item);
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  height: 100%;
  & > div {
    height: 150px;
  }
}
.column-title {
  font-weight: bold !important;
}
</style>
