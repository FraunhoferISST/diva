<template>
  <v-container class="pa-0">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title><h2>Scope</h2></v-list-item-title>
            <v-list-item-subtitle>
              <h2>{{ value.scope }}</h2>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title><h2>Country</h2></v-list-item-title>
            <v-list-item-subtitle>
              <h2>{{ country }}</h2>
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
import countries from "@/utils/countriesAll.json";

export default {
  name: "StdAlpha3CountryCodeViewer",
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { snackbar, message, color } = useSnackbar();
    const { loading, error } = useRequest();
    const country = countries.find(
      (e) => e["alpha-3"] === props.value.code
    ).name;
    return {
      loading,
      error,
      snackbar,
      message,
      color,
      country,
    };
  },
};
</script>

<style scoped lang="scss"></style>
