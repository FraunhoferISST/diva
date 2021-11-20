<template>
  <no-data-state v-if="!location" text="You can provide a location here" />
  <div v-else class="mapstyle">
    <l-map :zoom="zoom" :center="location.coordinates">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="location.coordinates"></l-marker>
    </l-map>
  </div>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

export default {
  name: "GeneralLocation",
  components: {
    NoDataState,
    LMap,
    LTileLayer,
    LMarker,
  },
  props: {
    location: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      center: [51.505, -0.159],
      markerLatLng: [51.504, -0.159],
    };
  },
};
</script>

<style scoped lang="scss">
.mapstyle {
  width: 100%;
  height: 300px;
}
</style>
