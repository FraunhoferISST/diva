<template>
  <div v-if="hasValues">
    <div>
      <v-chip
        class="ml-1 mb-1"
        small
        label
        v-for="(option, i) in preparedValue"
        :key="option + '_' + i"
      >
        {{ option }}
      </v-chip>
    </div>
  </div>
  <no-data-state v-else>
    <span v-if="editable">Add {{ title }}</span>
    <span v-else>Value of {{ title }} is not editable</span>
  </no-data-state>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import entityFieldViewerInterfaces from "@/components/Entity/EntityFields/EntityField/entityFieldViewerInterface";

export default {
  name: "SelectFieldViewer",
  components: { NoDataState },
  inheritAttrs: false,
  props: {
    ...entityFieldViewerInterfaces,
    value: {
      type: [String, Number, Array],
      required: true,
    },
  },
  computed: {
    preparedValue() {
      return this.isArray ? this.value : [this.value];
    },
    hasValues() {
      return this.value?.length > 0;
    },
    isArray() {
      return Array.isArray(this.value);
    },
  },
};
</script>

<style scoped></style>
