<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="12">
        <custom-header> Destroy Conditions </custom-header>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-select
          :items="conditionExtensions"
          item-text="displayName"
          item-value="name"
          outlined
          dense
          @change="(value) => (selectedDestroyCondition = value)"
        >
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <component
          v-bind:is="renderDestroyConditionComponent"
          @update:payload="setPayload"
        ></component>
      </v-col>
    </v-row>
    <v-row class="mt-8">
      <v-col cols="12" md="4" offset-md="6">
        <v-btn
          color="primary"
          class="gprimary"
          rounded
          block
          v-show="selectedDestroyCondition"
          :disabled="!addable"
          @click="addNewDestroyCondition"
        >
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
import { ref, reactive, computed } from "@vue/composition-api";

import StdFromPointInTimeEditor from "@/components/Entity/EntityFields/EntityField/DestroyClaims/Extensions/StdFromPointInTimeEditor";

export default {
  name: "DestroyConditions",
  components: {
    CustomHeader,
    StdFromPointInTimeEditor,
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
    const { datanetwork, entityApi } = useApi(props.id);

    const conditionExtensions = [
      {
        name: "",
        displayName: "",
        componentName: "",
      },
      {
        name: "std:fromPointInTime",
        displayName: "From Point In Time",
        componentName: StdFromPointInTimeEditor,
      },
      {
        name: "std:alpha3CountryCode",
        displayName: "Alpha3 Country Code",
        componentName: StdFromPointInTimeEditor,
      },
      {
        name: "std:geoLocation",
        displayName: "Geo Location",
        componentName: StdFromPointInTimeEditor,
      },
    ];
    const addable = ref(false);
    const selectedDestroyCondition = ref("");
    const payload = reactive({});
    const renderDestroyConditionComponent = computed(() => {
      return conditionExtensions.find(
        (e) => e.name === selectedDestroyCondition.value
      ).componentName;
    });
    const setPayload = (e) => {
      payload.value = e;
      addable.value = true;
      console.log(payload.value);
    };
    const addNewDestroyCondition = () => {
      return request(
        entityApi.create({
          title: `Destroy Condition of ${props.id}`,
          destroyclaimType: "destroyCondition",
          entityType: "destroyclaim",
          attributedTo: `${props.id}`,
          destroyclaimExtensionName: selectedDestroyCondition.value,
          destroyclaimExtensionPayload: payload.value,
        })
      ).then(() => {
        const unacceptableError =
          error.value && error.value?.response?.status !== 409;
        if (unacceptableError) {
          show(error.value, { color: "error" });
        } else {
          //reloadListMethod();
        }
        /*
        updateEntityMethod({
          doc: { ...entity, loading: false, added: !unacceptableError },
        });*/
      });
    };
    return {
      loading,
      error,
      snackbar,
      message,
      color,
      conditionExtensions,
      selectedDestroyCondition,
      renderDestroyConditionComponent,
      setPayload,
      addable,
      addNewDestroyCondition,
    };
  },
};
</script>

<style scoped lang="scss"></style>
