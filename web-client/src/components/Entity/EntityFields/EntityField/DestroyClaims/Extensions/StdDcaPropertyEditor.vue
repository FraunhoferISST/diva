<template>
  <v-container class="pa-0">
    <v-row>
      <v-col>
        <custom-header> DCA Property (std:dcaProperty) </custom-header>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-alert border="left" colored-border type="info" elevation="2">
          A DCA (Destroy Claim Agent) may have labels that further describe or
          classify it. You can use these labels to decide whether a Destroy
          Claim should be executed by that specific DCA.
          <br />
          Please enter a label and decide whether the label must be set or must
          not be set by the DCA.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <v-text-field
          class="pt-5"
          v-model="label"
          outlined
          dense
          label="enter label"
          prepend-inner-icon="mdi-label-outline"
          @change="payloadChange"
        ></v-text-field>
      </v-col>
      <v-col md="4">
        <v-radio-group v-model="has" @change="payloadChange" :column="false">
          <v-radio
            class="px-3"
            label="label must be set"
            value="true"
          ></v-radio>
          <v-radio
            class="px-3"
            label="label must not be set"
            value="false"
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
  name: "StdDcaPropertyEditor",
  components: {
    CustomHeader,
  },
  props: {},
  setup(props, context) {
    const { snackbar, message, color } = useSnackbar();
    const { loading, error } = useRequest();

    const items = reactive(countries);
    const label = ref("");
    const has = ref("true");

    const payloadChange = () => {
      if (label.value !== "") {
        context.emit("update:payload", {
          label: label.value,
          has: has.value === "true" ? true : false,
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
      label,
      has,
      payloadChange,
    };
  },
};
</script>

<style scoped lang="scss"></style>
