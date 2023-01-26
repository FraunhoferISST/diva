<template>
  <v-container class="pa-0">
    <v-row>
      <v-col>
        <custom-header>
          Destroy Claim valid when DCA has (not) Property (std:dcaProperty)
        </custom-header>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <v-text-field
          v-model="tag"
          outlined
          dense
          label="input a tag"
          prepend-inner-icon="mdi-tag"
          @change="payloadChange"
        ></v-text-field>
      </v-col>
      <v-col md="4">
        <v-radio-group v-model="has" @change="payloadChange" :column="false">
          <v-radio label="Apply when DCA has Property" value="true"></v-radio>
          <v-radio
            label="Apply when DCA not has Property"
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
    const tag = ref("");
    const has = ref("true");

    const payloadChange = () => {
      if (tag.value !== "") {
        context.emit("update:payload", {
          property: tag.value,
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
      tag,
      has,
      payloadChange,
    };
  },
};
</script>

<style scoped lang="scss"></style>
