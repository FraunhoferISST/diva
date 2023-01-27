<template>
  <v-container class="pa-0">
    <v-row>
      <v-col>
        <custom-header>
          Valid inside/outside Geo Location (std:geoLocation)
        </custom-header>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <location-map
          :location="location"
          :editable="true"
          @change="locationChange"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6">
        <v-radio-group v-model="scope" @change="payloadChange" :column="false">
          <v-radio
            label="valid within selected geo location"
            value="inside"
          ></v-radio>
          <v-radio
            label="valid outside selected geo location"
            value="outside"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";
import { ref, reactive } from "@vue/composition-api";
import LocationMap from "@/components/Charts/LocationMap";

export default {
  name: "StdGeoLocationEditor",
  components: {
    CustomHeader,
    LocationMap,
  },
  props: {},
  setup(props, context) {
    const { snackbar, message, color } = useSnackbar();
    const { loading, error } = useRequest();

    let location = reactive({});
    const scope = ref("inside");

    const payloadChange = () => {
      if (Object.keys(location ?? {}).length > 0) {
        context.emit("update:payload", {
          location: location,
          scope: scope.value,
        });
      }
    };

    const locationChange = (data) => {
      location = data;
      payloadChange();
    };

    return {
      loading,
      error,
      snackbar,
      message,
      color,
      scope,
      location,
      payloadChange,
      locationChange,
    };
  },
};
</script>

<style scoped lang="scss"></style>
