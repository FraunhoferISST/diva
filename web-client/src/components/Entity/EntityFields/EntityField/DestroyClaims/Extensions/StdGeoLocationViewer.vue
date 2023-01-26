<template>
  <v-container class="pa-0">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title
              ><h2>Destroy Claim valid when DCA is</h2></v-list-item-title
            >
            <v-list-item-subtitle>
              <h2>{{ value.scope }}</h2>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title><h2>Location</h2></v-list-item-title>
            <v-list-item-subtitle>
              <location-map :location="value.location" :editable="false" />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
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
  setup(props) {
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
