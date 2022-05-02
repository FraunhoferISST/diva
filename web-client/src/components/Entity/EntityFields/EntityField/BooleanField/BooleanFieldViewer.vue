<template>
  <info-block-value v-if="value !== false || value !== true">
    <v-switch
      class="ma-0"
      dense
      inset
      hide-details
      readonly
      v-model="computedValue"
      :label="title"
    ></v-switch>
  </info-block-value>
  <no-data-state v-else> Add {{ title }} </no-data-state>
</template>

<script>
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import NoDataState from "@/components/Base/NoDataState";
import entityFieldViewerInterfaces from "@/components/Entity/EntityFields/EntityField/entityFieldViewerInterface";

export default {
  name: "BooleanFieldViewer",
  inheritAttrs: false,
  components: {
    NoDataState,
    InfoBlockValue,
  },
  props: {
    ...entityFieldViewerInterfaces,
    value: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
    },
  },
};
</script>

<style scoped></style>
