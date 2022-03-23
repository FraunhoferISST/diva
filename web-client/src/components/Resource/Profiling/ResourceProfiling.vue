<template>
  <v-container fluid class="pa-0">
    <data-viewer>
      <component :is="profilingView" :id="id" :data="data" />
    </data-viewer>
  </v-container>
</template>

<script>
import NotSupportedType from "@/components/Resource/Profiling/Types/NotSupportedType";
import TabledataResourceProfiling from "@/components/Resource/Profiling/Types/TabledataResourceProfiling";
import TextResourceProfiling from "@/components/Resource/Profiling/Types/TextProfiling/TextResourceProfiling";
import ImageResourceProfiling from "@/components/Resource/Profiling/Types/ImageResourceProfiling";
import DataViewer from "@/components/DataFetchers/DataViewer";

export default {
  name: "ResourceProfiling",
  components: {
    DataViewer,
    NotSupportedType,
    TabledataResourceProfiling,
    TextResourceProfiling,
    ImageResourceProfiling,
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
      "text/csv": TabledataResourceProfiling,
      "application/x-sas-data": TabledataResourceProfiling,
      "text/plain": TextResourceProfiling,
      "application/pdf": TextResourceProfiling,
      "image/jpeg": ImageResourceProfiling,
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
    fetchProfilingData() {
      return this.$api.resources
        .getById(this.id)
        .then(({ data }) => (this.data = data));
    },
  },
};
</script>
<style lang="scss" scoped></style>
