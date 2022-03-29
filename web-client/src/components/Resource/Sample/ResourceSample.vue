<template>
  <section id="sample">
    <data-viewer :loading="loading" :error="error" :updating="updating">
      <v-container fluid class="pa-0">
        <component :is="sampleView" :data="data"></component>
      </v-container>
    </data-viewer>
  </section>
</template>

<script>
import TabledataResourceSample from "@/components/Resource/Sample/Types/TabledataResourceSample";
import ImageResourceSample from "@/components/Resource/Sample/Types/ImageResourceSample";
import NotSupportedType from "@/components/Resource/Profiling/Types/NotSupportedType";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useEntity } from "@/composables/entity";
import { useBus } from "@/composables/bus";
import { computed } from "@vue/composition-api";

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
  setup(props) {
    const mimeTypeToComponentMap = {
      "text/csv": TabledataResourceSample,
      "application/x-sas-data": TabledataResourceSample,
      "image/jpeg": ImageResourceSample,
    };
    const { on } = useBus();
    on("reload", reload);
    const { data, load, loading, error, reload, updating } = useEntity(
      props.id
    );
    load({
      fields: "mimeType,tableSample,tableSchema,imageThumbnail",
    });
    return {
      data,
      loading,
      error,
      updating,
      sampleView: computed(
        () => mimeTypeToComponentMap[data.value?.mimeType] || NotSupportedType
      ),
    };
  },
};
</script>
