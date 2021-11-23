<template>
  <no-data-state
    v-if="!hasPoliticalGeocoding"
    text="You can provide themes here"
  >
  </no-data-state>
  <div v-else>
    <v-chip
      class="ml-1 mt-1"
      small
      label
      v-for="(theme, i) in politicalGeocoding"
      :key="theme + '_' + i"
    >
      {{ theme }}</v-chip
    >
  </div>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "GeneralPoliticalGeocoding",
  components: { NoDataState },
  props: {
    politicalGeocoding: {
      type: Array,
      required: true,
    },
  },
  computed: {
    hasPoliticalGeocoding() {
      return this.politicalGeocoding && this.politicalGeocoding.length > 0;
    },
  },
};
</script>
