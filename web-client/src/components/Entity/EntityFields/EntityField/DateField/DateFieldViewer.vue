<template>
  <info-block-value v-if="value">
    <date-display :date="value" />
  </info-block-value>
  <no-data-state v-else> Add {{ title }} </no-data-state>
</template>

<script>
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import NoDataState from "@/components/Base/NoDataState";
import DateDisplay from "@/components/Base/DateDisplay";
export default {
  name: "DateFieldViewer",
  inheritAttrs: false,
  components: {
    DateDisplay,
    NoDataState,
    InfoBlockValue,
  },
  props: {
    property: {
      type: String,
      required: true,
    },
    value: {
      type: String,
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
