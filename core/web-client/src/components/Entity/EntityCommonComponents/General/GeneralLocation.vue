<template>
  <div>
    {{ hasLocation }}
    <no-data-state v-if="!hasLocation" text="You can provide a location here" />
    <location-map v-else :location="location" :editable="false" />
  </div>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import LocationMap from "@/components/Charts/LocationMap";

export default {
  name: "GeneralLocation",
  components: {
    LocationMap,
    NoDataState,
  },
  props: {
    location: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasLocation() {
      return Object.keys(this.location).length > 0;
    },
  },
};
</script>

<style scoped lang="scss"></style>
