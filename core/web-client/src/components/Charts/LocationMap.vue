<template>
  <div
    id="location-map"
    ref="map"
    class="location-map"
    :style="{ height: `${height}px` }"
  ></div>
</template>

<script>
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default {
  name: "LocationMap",
  props: {
    location: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      default: 450,
    },
    zoom: {
      type: Number,
      default: 7,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    editableLayers: null,
    map: null,
  }),
  watch: {
    location() {
      if (!this.editable) {
        // do not update if in edit mode
        this.updateMap();
      }
    },
  },
  methods: {
    renderMap() {
      this.map = L.map("location-map", {
        center: L.GeoJSON.coordsToLatLng([
          7.400397062301635,
          51.49351838098325,
        ]),
        edit: this.editable,
        zoom: this.zoom,
      });

      L.tileLayer(this.url, {
        attribution: this.attribution,
      }).addTo(this.map);

      this.$nextTick(() => {
        this.editableLayers = new L.FeatureGroup(this.location).addTo(this.map);
        if (Object.keys(this.location ?? {}).length > 0) {
          const geojsonLayer = L.geoJSON(this.location);
          geojsonLayer.eachLayer((l) => {
            this.editableLayers.addLayer(l);
          });
          this.map.fitBounds(this.editableLayers.getBounds());
        }

        this.drawControl = new L.Control.Draw({
          position: "bottomright",
          draw: this.editable
            ? {
                marker: true,
                polyline: false,
                polygon: true,
                rectangle: true,
                circle: true,
                circlemarker: false,
              }
            : false,
          edit: this.editable
            ? {
                edit: this.editable,
                remove: true,
                featureGroup: this.editableLayers,
              }
            : false,
        });
        this.map.addControl(this.drawControl);
        this.map.on(L.Draw.Event.CREATED, (e) => {
          this.editableLayers.addLayer(e.layer);
          this.$emit("change", this.editableLayers.toGeoJSON());
        });
        this.map.on(L.Draw.Event.EDITED, (e) => {
          const temp = L.featureGroup(this.editableLayers.getLayers());
          e.layers.eachLayer((l) => {
            temp.removeLayer(l);
            temp.addLayer(l);
          });
          this.editableLayers = temp;
          this.$emit("change", this.editableLayers.toGeoJSON());
        });
        this.map.on(L.Draw.Event.DELETED, (e) => {
          e.layers.eachLayer((l) => {
            this.editableLayers.removeLayer(l);
          });
          this.$emit("change", this.editableLayers.toGeoJSON());
        });
        setTimeout(() => {
          this.map.invalidateSize();
          if (Object.keys(this.location ?? {}).length > 0) {
            this.map.fitBounds(this.editableLayers.getBounds());
          }
        }, 200);
      });
    },
    updateMap() {
      this.editableLayers.eachLayer((l) => this.editableLayers.removeLayer(l));
      if (Object.keys(this.location ?? {}).length > 0) {
        const geojsonLayer = L.geoJSON(this.location);
        geojsonLayer.eachLayer((l) => {
          this.editableLayers.addLayer(l);
        });
        this.map.fitBounds(this.editableLayers.getBounds());
      }
    },
  },
  mounted() {
    this.renderMap();
  },
};
</script>

<style scoped lang="scss">
.location-map {
  width: 100%;
}
</style>
