<template>
  <no-data-state v-if="!hasOptions"> Edit {{ title }} </no-data-state>
  <div v-else>
    <v-chip
      class="ml-1 mt-1"
      small
      label
      v-for="(option, i) in value"
      :key="option + '_' + i"
    >
      {{ option }}
    </v-chip>
  </div>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "SelectFieldViewer",
  components: { NoDataState },
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  computed: {
    hasOptions() {
      return this.value.length > 0;
    },
  },
};
</script>

<style scoped></style>
