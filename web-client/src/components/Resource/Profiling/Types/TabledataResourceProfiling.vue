<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12">
        <custom-header>Metadata</custom-header>
      </v-col>
      <v-col cols="12">
        <v-container fluid class="pa-0" slot="body">
          <meta-data :data="data" class="pt-2" />
        </v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-row>
          <v-col cols="12">
            <custom-header>Not nullish values</custom-header>
          </v-col>
          <v-col cols="12" sm="6">
            <progress-circle :progress="NotNullElementsPercentage" :size="150">
              <span slot="legend-value">%</span>
            </progress-circle>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <v-row>
          <v-col cols="12">
            <custom-header>Type correctness</custom-header>
          </v-col>
          <v-col cols="12" sm="6">
            <progress-circle :progress="typeCorrectness" :size="150">
              <span slot="legend-value">%</span>
            </progress-circle>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <custom-header>Schema</custom-header>
      </v-col>
      <v-col cols="12">
        <csv-network v-if="schema.length > 1" :nodes="schema" height="620" />
        <no-data-state v-else slot="body"></no-data-state>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <custom-header>Columns statistics</custom-header>
      </v-col>
      <v-col cols="12" v-if="data.columnStatistics">
        <v-row>
          <v-col cols="12">
            <table-data-profiling-table
              slot="body"
              :columns="data.columnStatistics"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!--    <v-row>
      <v-col cols="12">
        <card header="Estimated personal data privacy">
          <personal-data-evaluation
            v-if="data.personalData"
            slot="body"
            :data="data.personalData"
          />
          <no-data-state v-else slot="body"></no-data-state>
        </card>
      </v-col>
    </v-row>-->
  </v-container>
</template>

<script>
import CsvNetwork from "@/components/Charts/CsvNetwork";
import NoDataState from "@/components/Base/NoDataState";
import TableDataProfilingTable from "@/components/Tables/TableDataProfilingTable";
import ProgressCircle from "@/components/Charts/ProgressCircle";
// import PersonalDataEvaluation from "@/components/Resource/Profiling/Common/PersonalDataEvaluation";
import MetaData from "@/components/Resource/Profiling/Common/MetaData";
import CustomHeader from "@/components/Base/CustomHeader";

export default {
  name: "TabledataResourceProfiling",
  components: {
    CustomHeader,
    MetaData,
    /*PersonalDataEvaluation,*/
    ProgressCircle,
    TableDataProfilingTable,
    NoDataState,
    CsvNetwork,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selectedColumnIds: [],
  }),
  computed: {
    schema() {
      let nodes = [];
      nodes.push({ name: this.data.filename });
      nodes.push(...(this.data.tableSchema || []));
      return nodes;
    },
    NotNullElementsPercentage() {
      const maxRows = this.data.columnStatistics
        ?.map(({ maxNumberOfRows }) => maxNumberOfRows)
        .reduce((acc, val) => acc + val);
      const nullRows = this.data.columnStatistics
        ?.map(({ numberOfNullElements }) => numberOfNullElements)
        .reduce((acc, val) => acc + val);
      return 100 - ((parseFloat(nullRows) * 100) / (maxRows || 1)).toFixed(2);
    },
    typeCorrectness() {
      const columns = this.data.columnStatistics ?? [];

      let strings = columns.filter((col) => col.dataType === "string");
      let numbers = columns.filter((col) => col.dataType === "number");

      let errorRows = 0;
      let maxRows = 0;

      for (let col of columns) {
        maxRows += col.maxNumberOfRows;
      }

      strings.forEach((e) => {
        errorRows += e.numberOfNumbers;
      });

      numbers.forEach((e) => {
        errorRows += e.numberOfStrings;
      });
      return 100 - parseFloat(((errorRows * 100) / maxRows).toFixed(2));
    },
  },
};
</script>

<style scoped lang="scss"></style>
