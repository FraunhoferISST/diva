<template>
  <div v-if="hasValues">
    <div>
      <v-chip
        class="ml-1 mt-1"
        small
        label
        v-for="(option, i) in preparedValue"
        :key="option + '_' + i"
      >
        {{ option }}
      </v-chip>
    </div>
  </div>
  <no-data-state v-else> Add {{ title }} </no-data-state>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "SelectFieldViewer",
  components: { NoDataState },
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number, Array],
      required: true,
    },
    title: {
      type: String,
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
