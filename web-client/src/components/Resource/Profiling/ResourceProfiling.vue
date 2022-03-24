<template>
  <v-container fluid class="pa-0">
    <data-viewer :loading="loading" :updating="updating">
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
import { useBus } from "@/composables/bus";
import { useEntity } from "@/composables/entity";
import { computed } from "@vue/composition-api/dist/vue-composition-api";

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
  setup(props) {
    const mimeTypeToComponentMap = {
      "text/csv": TabledataResourceProfiling,
      "application/x-sas-data": TabledataResourceProfiling,
      "text/plain": TextResourceProfiling,
      "application/pdf": TextResourceProfiling,
      "image/jpeg": ImageResourceProfiling,
    };
    const { on } = useBus();
    on("reload", reload);
    const { data, load, loading, error, reload, updating } = useEntity(
      props.id
    );
    load();
    return {
      data,
      loading,
      error,
      updating,
      profilingView: computed(
        () => mimeTypeToComponentMap[data.value?.mimeType] || NotSupportedType
      ),
    };
  },
};
</script>
<style lang="scss" scoped></style>
