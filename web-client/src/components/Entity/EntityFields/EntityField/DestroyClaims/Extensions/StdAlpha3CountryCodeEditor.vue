<template>
  <v-container class="pa-0">
    <v-row>
      <v-col>
        <custom-header>
          Valid inside/outside Country (std:alpha3CountryCode)
        </custom-header>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-alert border="left" colored-border type="info" elevation="2">
          You can specify whether a Destroy Claim should be valid when the
          executing DCA is within or outside a certain country.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <v-autocomplete
          class="pt-5"
          v-model="selected"
          :items="items"
          item-text="name"
          item-value="alpha-3"
          outlined
          dense
          chips
          small-chips
          label="Select Country"
          @change="payloadChange"
        ></v-autocomplete>
      </v-col>
      <v-col md="4">
        <v-radio-group v-model="scope" @change="payloadChange" :column="false">
          <v-radio
            label="valid within selected country"
            value="inside"
          ></v-radio>
          <v-radio
            label="valid outside selected country"
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

import countries from "@/utils/countriesAll.json";

export default {
  name: "StdAlpha3CountryCodeEditor",
  components: {
    CustomHeader,
  },
  props: {},
  setup(props, context) {
    const { snackbar, message, color } = useSnackbar();
    const { loading, error } = useRequest();

    const items = reactive(countries);
    const selected = ref("");
    const scope = ref("inside");

    const payloadChange = () => {
      if (selected.value !== "") {
        context.emit("update:payload", {
          code: selected.value,
          scope: scope.value,
        });
      }
    };

    return {
      loading,
      error,
      snackbar,
      message,
      color,
      items,
      selected,
      scope,
      payloadChange,
    };
  },
};
</script>

<style scoped lang="scss"></style>
