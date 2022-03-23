<template>
  <section id="sample">
    <data-viewer>
      <v-container fluid class="pa-0">
        <component :is="profilingView" :data="data"></component>
      </v-container>
    </data-viewer>
  </section>
</template>

<script>
import TabledataResourceSample from "@/components/Resource/Sample/Types/TabledataResourceSample";
import ImageResourceSample from "@/components/Resource/Sample/Types/ImageResourceSample";
import NotSupportedType from "@/components/Resource/Profiling/Types/NotSupportedType";
import DataViewer from "@/components/DataFetchers/DataViewer";

export default {
  name: "ResourceSample",
  components: {
    DataViewer,
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
