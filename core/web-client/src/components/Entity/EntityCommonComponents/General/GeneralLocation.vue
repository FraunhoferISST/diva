<template>
  <no-data-state v-if="!location" text="You can provide a location here" />
  <l-map v-else ref="map" :zoom="zoom" class="mapstyle">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
  </l-map>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import L from "leaflet";
import { LMap, LTileLayer } from "vue2-leaflet";
import "leaflet-draw";

export default {
  name: "GeneralLocation",
  components: {
    NoDataState,
    LMap,
    LTileLayer,
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
      zoom: 4,
      editableLayers: null,
    };
  },
  mounted() {
    const self = this;
    this.$refs.map.mapObject._onResize(); // important to render map correctly

    this.$nextTick(() => {
      const map = this.$refs.map.mapObject;
      self.editableLayers = new L.FeatureGroup(self.location).addTo(map);

      const geojsonLayer = L.geoJSON(self.location);
      geojsonLayer.eachLayer(function (l) {
        self.editableLayers.addLayer(l);
      });

      this.drawControl = new L.Control.Draw({
        position: "bottomright",
        draw: {
          polyline: false,
          polygon: true,
          rectangle: true,
          circle: false,
          circlemarker: false,
          marker: true,
        },
        edit: {
          remove: true,
          featureGroup: self.editableLayers,
        },
      });

      map.addControl(this.drawControl);
      map.on(L.Draw.Event.CREATED, (e) => {
        // const type = e.layerType;
        const layer = e.layer;
        console.log(e);
        // Do whatever else you need to. (save to db, add to map etc)
        self.editableLayers.addLayer(layer);
        console.log(self.editableLayers.toGeoJSON()); // can be used to be stored in DIVA backend
      });
    });
  },
};
</script>

<style scoped lang="scss">
.mapstyle {
  height: 400px;
  width: 100%;
}
</style>
