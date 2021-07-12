<template>
  <section id="sample">
    <reactive-data-fetcher :id="id" :fetch-method="fetchSampleData">
      <v-container fluid>
        <component :is="profilingView" :data="data"></component>
      </v-container>
    </reactive-data-fetcher>
  </section>
</template>

<script>
import TabledataResourceSample from "@/components/Resource/Sample/Types/TabledataResourceSample";
import ImageResourceSample from "@/components/Resource/Sample/Types/ImageResourceSample";
import ReactiveDataFetcher from "@/components/DataFetchers/ReactiveDataFetcher";
import NotSupportedType from "@/components/Resource/Profiling/Types/NotSupportedType";

export default {
  name: "ResourceSample",
  components: {
    ReactiveDataFetcher,
    TabledataResourceSample,
    ImageResourceSample,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    data: {},
    mimeTypeToComponentMap: {
      "text/csv": TabledataResourceSample,
      "application/x-sas-data": TabledataResourceSample,
      "image/jpeg": ImageResourceSample,
    },
  }),
  computed: {
    profilingView() {
      return (
        this.mimeTypeToComponentMap[this.data.mimeType] || NotSupportedType
      );
    },
  },
  methods: {
    fetchSampleData() {
      return this.$api.resources
        .getById(this.id, {
          fields: "mimeType,tableSample,tableSchema,imageThumbnail",
        })
        .then(({ data }) => (this.data = data));
    },
  },
};
</script>
