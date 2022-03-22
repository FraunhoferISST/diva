<template>
  <info-block-value v-if="value">
    {{ value }}
  </info-block-value>
  <no-data-state v-else> Add {{ title }} </no-data-state>
</template>

<script>
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "PrimitiveFieldViewer",
  components: {
    NoDataState,
    InfoBlockValue,
  },
  props: {
    property: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
