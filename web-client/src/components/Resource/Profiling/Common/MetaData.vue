<template>
  <v-row class="full-width">
    <v-col cols="12" v-if="metaData.length > 0">
      <v-row v-if="metaData.length > 0">
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="4"
          xl="4"
          v-for="meta in metaData"
          :key="meta.title"
        >
          <info-block :title="meta.title" :value="meta.value" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" v-else>
      <no-data-state />
    </v-col>
  </v-row>
</template>

<script>
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import metaDataList from "@/components/Resource/Profiling/metaDataList";
import NoDataState from "@/components/Base/NoDataState";

export default {
  name: "MetaData",
  components: { NoDataState, InfoBlock },
  props: {
    data: {
      type: Object,
      required: true,
    },
    additional: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    metaData() {
      const meta = metaDataList.map((prop) => ({
        title: prop,
        value: this.data[prop] ?? undefined,
      }));
      meta.push(...this.additional);
      return meta.filter(({ value }) => !!value);
    },
  },
};
</script>

<style scoped></style>
