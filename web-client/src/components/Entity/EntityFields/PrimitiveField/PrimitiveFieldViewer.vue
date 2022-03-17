<template>
  <info-block>
    <template #title>
      <info-block-title>
        {{ title }}
      </info-block-title>
    </template>
    <template #value>
      <info-block-value v-if="value">
        {{ value }}
      </info-block-value>
      <no-data-state v-else> Add {{ title }} </no-data-state>
    </template>
  </info-block>
</template>

<script>
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "PrimitiveFieldViewer",
  components: {
    NoDataState,
    InfoBlockValue,
    InfoBlockTitle,
    InfoBlock,
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
