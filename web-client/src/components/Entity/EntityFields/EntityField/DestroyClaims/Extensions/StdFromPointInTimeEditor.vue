<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="12">
        <custom-header> From Point in Time </custom-header>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-date-picker
          v-model="picker"
          :show-current="false"
          full-width
          prev-icon="mdi-skip-previous"
          next-icon="mdi-skip-next"
          elevation="15"
          header-color="primary"
          @change="payloadChange"
        ></v-date-picker>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import { useRequest } from "@/composables/request";
import { useApi } from "@/composables/api";
import { useSnackbar } from "@/composables/snackbar";
import { ref, reactive, computed } from "@vue/composition-api";

export default {
  name: "StdFromPointInTimeEditor",
  components: {
    CustomHeader,
  },
  props: {},
  setup(props, context) {
    const { snackbar, message, color, show } = useSnackbar();
    const { request, loading, error } = useRequest();
    const { datanetwork } = useApi();

    const picker = ref("");

    const payloadChange = () => {
      context.emit("update:payload", {
        from: new Date(picker.value).toISOString(),
      });
    };

    return {
      loading,
      error,
      snackbar,
      message,
      color,
      picker,
      payloadChange,
    };
  },
};
</script>

<style scoped lang="scss"></style>
