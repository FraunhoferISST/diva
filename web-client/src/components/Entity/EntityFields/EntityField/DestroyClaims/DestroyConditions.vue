<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <custom-header> Destroy Conditions </custom-header>
        <v-tooltip top open-delay="600" max-width="400px">
          <template #activator="{ on, attrs }">
            <v-icon
              v-show="!showDestroyConditionExplanation"
              @click="
                showDestroyConditionExplanation =
                  !showDestroyConditionExplanation
              "
              color="primary"
              dense
              v-bind="attrs"
              v-on="on"
            >
              info_outline
            </v-icon>
            <v-icon
              v-show="showDestroyConditionExplanation"
              @click="
                showDestroyConditionExplanation =
                  !showDestroyConditionExplanation
              "
              color="primary"
              dense
              v-bind="attrs"
              v-on="on"
            >
              info
            </v-icon>
          </template>
          <span>Click here to show or hide explanation</span>
        </v-tooltip>
      </v-col>
      <v-col v-if="showDestroyConditionExplanation">
        <v-alert border="left" colored-border color="primary" elevation="5">
          TBD
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-select
          :items="conditionExtensions"
          item-text="displayName"
          item-value="name"
          label="Add new Destroy Condition to Destroy Claim"
          outlined
          dense
          @change="(value) => (selectedDestroyCondition = value)"
        >
        </v-select>
      </v-col>
    </v-row>
    <v-row v-show="selectedDestroyCondition">
      <v-col cols="12">
        <component
          v-bind:is="renderDestroyConditionComponent"
          @update:payload="setPayload"
        ></component>
      </v-col>
    </v-row>
    <v-row class="mt-8" v-show="selectedDestroyCondition">
      <v-col cols="12" md="4" offset-md="8">
        <v-btn
          color="primary"
          class="gprimary"
          rounded
          block
          v-show="selectedDestroyCondition"
          :disabled="!addable"
          @click="() => addToDestroyCondition()"
        >
          Add new Destroy Condition
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <div class="destroy-subject-item full-width relative">
          <network-nodes-list
            :toId="id"
            edge-types="isDestroyConditionOf"
            :show-counter="false"
            :fullWidth="false"
            :key="updateNodeList"
          >
            <template #item="{ entity: destroyCondition, load }">
              <destroy-condition-mini-card
                class="fill-height full-width"
                :destroyCondition="destroyCondition"
                :visible="destroyCondition.visible"
                :load="load"
                :renderComponents="conditionExtensions"
                @update="() => updateNodeList + 1"
              />
            </template>
          </network-nodes-list>
        </div>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :color="color" fixed top>
      <b>{{ message }}</b>
    </v-snackbar>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import { useRequest } from "@/composables/request";
import { useApi } from "@/composables/api";
import { useSnackbar } from "@/composables/snackbar";
import { ref, reactive, computed } from "@vue/composition-api";
import NetworkNodesList from "@/components/Base/NetworkNodesList";
import DestroyConditionMiniCard from "@/components/Entity/EntityFields/EntityField/DestroyClaims/DestroyConditionMiniCard";

import StdFromPointInTimeEditor from "@/components/Entity/EntityFields/EntityField/DestroyClaims/Extensions/StdFromPointInTimeEditor";
import StdFromPointInTimeViewer from "@/components/Entity/EntityFields/EntityField/DestroyClaims/Extensions/StdFromPointInTimeViewer";
import StdToPointInTimeEditor from "@/components/Entity/EntityFields/EntityField/DestroyClaims/Extensions/StdToPointInTimeEditor";
import StdToPointInTimeViewer from "@/components/Entity/EntityFields/EntityField/DestroyClaims/Extensions/StdToPointInTimeViewer";
import StdAlpha3CountryCodeEditor from "@/components/Entity/EntityFields/EntityField/DestroyClaims/Extensions/StdAlpha3CountryCodeEditor";
import StdAlpha3CountryCodeViewer from "@/components/Entity/EntityFields/EntityField/DestroyClaims/Extensions/StdAlpha3CountryCodeViewer";

export default {
  name: "DestroyConditions",
  components: {
    CustomHeader,
    NetworkNodesList,
    DestroyConditionMiniCard,
    StdFromPointInTimeEditor,
    StdAlpha3CountryCodeEditor,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => {
    return {
      showDestroyConditionExplanation: false,
    };
  },
  setup(props) {
    const { snackbar, message, color, show } = useSnackbar();
    const { request, loading, error } = useRequest();
    const { datanetwork, entityApi } = useApi(props.id);

    const conditionExtensions = [
      {
        name: "",
        displayName: "",
        editorComponent: "",
      },
      {
        name: "std:fromPointInTime",
        displayName: "Destroy Claim valid from Date",
        editorComponent: StdFromPointInTimeEditor,
        viewerComponent: StdFromPointInTimeViewer,
      },
      {
        name: "std:toPointInTime",
        displayName: "Destroy Claim valid to Date",
        editorComponent: StdToPointInTimeEditor,
        viewerComponent: StdToPointInTimeViewer,
      },
      {
        name: "std:alpha3CountryCode",
        displayName: "Destroy Claim valid inside/outside Country",
        editorComponent: StdAlpha3CountryCodeEditor,
        viewerComponent: StdAlpha3CountryCodeViewer,
      },
      {
        name: "std:geoLocation",
        displayName: "Destroy Claim valid inside/outside Geo Location",
        editorComponent: StdFromPointInTimeEditor,
      },
    ];
    const addable = ref(false);
    const selectedDestroyCondition = ref("");
    const payload = reactive({});
    const updateNodeList = ref(0);
    const renderDestroyConditionComponent = computed(() => {
      return conditionExtensions.find(
        (e) => e.name === selectedDestroyCondition.value
      ).editorComponent;
    });
    const setPayload = (e) => {
      payload.value = e;
      addable.value = true;
    };
    const removeFromDestroyConditions = (edgeId, reloadListMethod) => {
      return request(datanetwork.deleteEdgeById(edgeId)).then(() => {
        const unacceptableError =
          error.value && error.value?.response?.status !== 404;
        if (unacceptableError) {
          show(error.value, { color: "error" });
        } else {
          reloadListMethod();
        }
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
      updateNodeList,
      addable,
      addToDestroyCondition: async (
        entity,
        updateEntityMethod,
        reloadListMethod
      ) => {
        //updateEntityMethod({ doc: { ...entity, loading: true } });

        return request(
          entityApi.create({
            title: `${
              conditionExtensions.find(
                (e) => e.name === selectedDestroyCondition.value
              ).displayName
            }`,
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
            // it takes some time to create edges in backend. No indication of creation in client available...
            setTimeout(function () {
              updateNodeList.value += 1;
            }, 1000);
          }

          /*updateEntityMethod({
            doc: { ...entity, loading: false, added: !unacceptableError },
          });*/
          addable.value = false;
          payload.value = {};
          selectedDestroyCondition.value = "";
        });
      },
      removeFromDestroyConditions,
      removeAllFromDestroyConditions(entities, reloadListMethod) {
        return Promise.all(
          entities.map(({ edgeId }) =>
            removeFromDestroyConditions(edgeId, () => {})
          )
        ).then(reloadListMethod);
      },
    };
  },
};
</script>

<style scoped lang="scss"></style>
