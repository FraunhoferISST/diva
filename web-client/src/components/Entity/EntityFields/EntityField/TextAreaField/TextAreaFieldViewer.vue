<template>
  <info-block-value v-if="value">
    {{ value }}
  </info-block-value>
  <no-data-state v-else> Add {{ title }} </no-data-state>
</template>

<script>
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import NoDataState from "@/components/Base/NoDataState";
import entityFieldViewerInterfaces from "@/components/Entity/EntityFields/EntityField/entityFieldViewerInterface";

export default {
  name: "TextAreaFieldViewer",
  inheritAttrs: false,
  components: {
    NoDataState,
    InfoBlockValue,
  },
  props: {
    ...entityFieldViewerInterfaces,
    value: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
