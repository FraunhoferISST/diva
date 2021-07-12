<template>
  <v-row>
    <v-col cols="12">
      <card header="Random sample data">
        <template slot="body">
          <v-simple-table dense v-if="data.tableSample">
            <template>
              <thead>
                <tr>
                  <th
                    class="text-left"
                    v-for="header in sampleHeaders"
                    :key="header"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in sampleValues" :key="i">
                  <td v-for="(value, j) in row" :key="j">{{ value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <no-data-state v-else text="No sample available" />
        </template>
      </card>
    </v-col>
  </v-row>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import Card from "@/components/Base/Card";
export default {
  name: "TabledataSample",
  components: {
    Card,
    NoDataState,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    sampleHeaders() {
      return (
        this.data.tableSchema ??
        Array.from({ length: this.sampleValues[0].length })
      )
        .map(({ name }) => name || "N/A")
        .sort((colA, colB) => colA.idx - colB.idx);
    },
    sampleValues() {
      return this.data.tableSample;
    },
  },
};
</script>

<style scoped lang="scss"></style>
