<template>
  <v-container class="pa-0">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <h2>
          Condition is fulfilled <v-chip label>{{ value.scope }}</v-chip> of geo
          location:
        </h2>
        <location-map
          class="mt-4"
          :location="value.location"
          :editable="false"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";
import LocationMap from "@/components/Charts/LocationMap";

export default {
  name: "StdFromPointInTimeEditor",
  components: {
    LocationMap,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { snackbar, message, color } = useSnackbar();
    const { loading, error } = useRequest();

    return {
      loading,
      error,
      snackbar,
      message,
      color,
    };
  },
};
</script>

<style scoped lang="scss"></style>
