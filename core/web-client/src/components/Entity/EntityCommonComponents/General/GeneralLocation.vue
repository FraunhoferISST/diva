<template>
  <no-data-state v-if="!location" text="You can provide a location here" />
  <l-map v-else ref="map" :zoom="zoom" class="mapstyle">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-geo-json :geojson="location"></l-geo-json>
  </l-map>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import L from "leaflet";
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
import "leaflet-draw";

export default {
  name: "GeneralLocation",
  components: {
    NoDataState,
    LMap,
    LTileLayer,
    LGeoJson,
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
      self.editableLayers = new window.L.FeatureGroup().addTo(map);

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
        console.log(layer);
        // Do whatever else you need to. (save to db, add to map etc)
        self.editableLayers.addLayer(layer);
      });
    });
  },
  /*
  mounted() {
    this.$nextTick(() => {
      
      

      window.L.DrawToolbar.include({
        getModeHandlers(_map) {
          return [
            {
              enabled: true,
              handler: new window.L.Draw.Polyline(_map),
              title: "Добавить тоннель",
            },
          ];
        },
      });

      this.drawControl.setDrawingOptions({
        // new lines will have different color
        polyline: {
          shapeOptions: {
            color: "#ff0a1e",
          },
        },
      });

      map.addControl(this.drawControl);

      this.editableLayers = new window.L.FeatureGroup().addTo(map);
      const control = this.drawControl._container.querySelector(
        ".leaflet-draw-toolbar"
      );

      let link = document.createElement("a");
      link.className = "leaflet-draw-draw-OK_ICON";
      link.style.display = "none";
      link.onclick = () => {
        this.$store.dispatch("tunnelEdit", this.newTunnel);
        this.$emit("tunnelAdd");
      };
      this.okBtn = control.appendChild(link);

      link = document.createElement("a");
      link.className = "leaflet-draw-draw-NOK_ICON";
      link.style.display = "none";
      link.onclick = () => {
        this.okBtn.style.display = "none";
        this.nokBtn.style.display = "none";
        this.layers.forEach((l) => this.editableLayers.removeLayer(l));
        this.newTunnel = {
          geometry: {
            coordinates: [],
          },
        };
      };
      this.nokBtn = control.appendChild(link);

      map.on(window.L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        const coords = layer._latlngs.map((objCoordinates) => [
          objCoordinates.lng,
          objCoordinates.lat,
        ]);

        this.newTunnel.geometry.coordinates.push(coords);
        this.newTunnel.categoryDate = 0;
        this.editableLayers.addLayer(layer);
        this.layers.push(layer);
        this.okBtn.style.display = "block";
        this.nokBtn.style.display = "block";
      });
    });
  },
  */
};
</script>

<style scoped lang="scss">
.mapstyle {
  height: 400px;
  width: 100%;
}
</style>
