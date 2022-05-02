<template>
  <info-block-value v-if="value">
    {{ value }}
  </info-block-value>
  <no-data-state v-else>
    <span v-if="editable">Add {{ title }}</span>
    <span v-else>Value of {{ title }} is not editable</span>
  </no-data-state>
</template>

<script>
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import NoDataState from "@/components/Base/NoDataState";
import entityFieldViewerInterfaces from "@/components/Entity/EntityFields/EntityField/entityFieldViewerInterface";
export default {
  name: "PrimitiveFieldViewer",
  inheritAttrs: false,
  components: {
    NoDataState,
    InfoBlockValue,
  },
  props: entityFieldViewerInterfaces,
};
</script>

<style scoped></style>
