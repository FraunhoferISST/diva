<template>
  <no-data-state
    v-if="!hasPoliticalGeocoding"
    text="Provide a political geocoding"
  >
  </no-data-state>
  <div v-else>
    <v-chip class="ml-1 mt-1" small label> {{ politicalGeocoding }}</v-chip>
  </div>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "GeneralPoliticalGeocoding",
  components: { NoDataState },
  props: {
    politicalGeocoding: {
      type: String,
      required: true,
    },
  },
  computed: {
    hasPoliticalGeocoding() {
      return this.politicalGeocoding;
    },
  },
};
</script>
