<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="12">
        <custom-header> Destroy Conditions </custom-header>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-select
          :items="conditionExtensions"
          item-text="displayName"
          item-value="name"
          outlined
          dense
        >
        </v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" class="gprimary" rounded block>
          Add new Destroy Condition
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import { useRequest } from "@/composables/request";
import { useApi } from "@/composables/api";
import { useSnackbar } from "@/composables/snackbar";

export default {
  name: "DestroyConditions",
  components: {
    CustomHeader,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { snackbar, message, color, show } = useSnackbar();
    const { request, loading, error } = useRequest();
    const { datanetwork } = useApi();

    const conditionExtensions = [
      {
        name: "std:fromPointInTime",
        displayName: "From Point In Time",
      },
      {
        name: "std:alpha3CountryCode",
        displayName: "Alpha3 Country Code",
      },
      {
        name: "std:geoLocation",
        displayName: "Geo Location",
      },
    ];
    return {
      loading,
      error,
      snackbar,
      message,
      color,
      conditionExtensions,
    };
  },
};
</script>

<style scoped lang="scss"></style>
