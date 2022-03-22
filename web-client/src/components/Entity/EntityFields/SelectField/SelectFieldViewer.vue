<template>
  <info-block>
    <template #value>
      <div v-if="value">
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
      <no-data-state v-else> Add {{ title }} </no-data-state>
    </template>
  </info-block>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
export default {
  name: "SelectFieldViewer",
  components: { InfoBlock, NoDataState },
  props: {
    value: {
      type: [String, Number, Array],
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
      return this.value?.length > 0;
    },
  },
};
</script>

<style scoped></style>
