<template>
  <v-container class="pa-0">
    <v-row>
      <v-col>
        <custom-header> DIVA Entity Property (std:divaProperty) </custom-header>
      </v-col>
    </v-row>
    <v-row
      ><v-col
        ><v-alert border="left" colored-border type="info" elevation="2">
          Whether a Destroy Claim is to be executed can be controlled with the
          help of the relations stored in DIVA.
        </v-alert></v-col
      ></v-row
    >
    <v-row>
      <v-col md="4"><h2>From Entity</h2></v-col
      ><v-col md="4"><h2>Relation Type</h2></v-col>
      <v-col md="4"><h2>To Entity</h2></v-col></v-row
    >
    <v-row>
      <v-col md="4">
        <v-autocomplete
          dense
          class="custom-autocomplete pt-3"
          v-model="selectedFromEntity"
          :loading="loading"
          :items="searchFromResult"
          :search-input.sync="searchFromInput"
          :disabled="disableFromEntity"
          chips
          outlined
          placeholder="Search entities"
          background-color="white"
          color="info"
          label="Select 'From' Entity (optional)"
          hide-selected
          hide-details
          cache-items
          item-text="title"
          item-value="id"
          clearable
          return-object
          @update:search-input="() => searchEntities(searchFromInput)"
          @change="
            () => {
              payloadChange();
            }
          "
        >
          <template #selection="data">
            <v-chip small :input-value="data.selected">
              <entity-avatar
                :size="5"
                :image-id="data.item.entityIcon"
                :entity-id="data.item.id"
                :entity-title="data.item.title"
                class="mr-2"
                style="margin-left: -12px"
              />
              <entity-details-link
                class="pr-2"
                :id="data.item.id"
                target="_blank"
              >
                {{ data.item.title }}
              </entity-details-link>
            </v-chip>
          </template>
          <template #item="data">
            <v-list-item-avatar>
              <entity-avatar
                :size="35"
                :image-id="data.item.entityIcon"
                :entity-id="data.item.id"
                :entity-title="data.item.title"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ data.item.title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ data.item.entityType }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col md="4">
        <v-select
          class="pt-3"
          v-model="selectedEdgeTypes"
          :items="edgeTypes"
          label="Select Relation Type (optional)"
          multiple
          chips
          small-chips
          outlined
          dense
          persistent-hint
          @change="
            () => {
              payloadChange();
            }
          "
        ></v-select>
      </v-col>
      <v-col md="4">
        <v-autocomplete
          dense
          class="custom-autocomplete pt-3"
          v-model="selectedToEntity"
          :loading="loading"
          :items="searchToResult"
          :search-input.sync="searchToInput"
          :disabled="disableToEntity"
          chips
          outlined
          placeholder="Search entities"
          background-color="white"
          color="info"
          label="Select 'To' Entity (optional)"
          hide-selected
          hide-details
          cache-items
          item-text="title"
          item-value="id"
          clearable
          return-object
          @update:search-input="() => searchEntities(searchToInput)"
          @change="
            () => {
              payloadChange();
            }
          "
        >
          <template #selection="data">
            <v-chip small :input-value="data.selected">
              <entity-avatar
                :size="5"
                :image-id="data.item.entityIcon"
                :entity-id="data.item.id"
                :entity-title="data.item.title"
                class="mr-2"
                style="margin-left: -12px"
              />
              <entity-details-link
                class="pr-2"
                :id="data.item.id"
                target="_blank"
              >
                {{ data.item.title }}
              </entity-details-link>
            </v-chip>
          </template>
          <template #item="data">
            <v-list-item-avatar>
              <entity-avatar
                :size="35"
                :image-id="data.item.entityIcon"
                :entity-id="data.item.id"
                :entity-title="data.item.title"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ data.item.title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ data.item.entityType }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <v-select
          class="pt-3"
          v-model="selectedFromNodeTypes"
          :items="nodeTypes"
          :disabled="disableFromNodeTypes"
          label="Select 'From' Node Types (optional)"
          multiple
          chips
          small-chips
          outlined
          dense
          persistent-hint
          @change="
            () => {
              payloadChange();
            }
          "
        ></v-select>
      </v-col>
      <v-col md="4">
        <v-switch
          v-model="bidirectional"
          inset
          dense
          :label="`${
            bidirectional
              ? 'ignore relation direction'
              : 'do not ignore relation direction'
          }`"
          @change="
            () => {
              payloadChange();
            }
          "
        ></v-switch>
      </v-col>
      <v-col md="4">
        <v-select
          class="pt-3"
          v-model="selectedToNodeTypes"
          :items="nodeTypes"
          :disabled="disableToNodeTypes"
          label="Select 'To' Node Types (optional)"
          multiple
          chips
          small-chips
          outlined
          dense
          persistent-hint
          @change="
            () => {
              payloadChange();
            }
          "
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4"><h2>Evaluation Method</h2></v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <v-select
          class="pt-3"
          v-model="selectedEvaluationMethod"
          :items="evaluationMethods"
          item-text="name"
          item-value="value"
          label="Select Evaluation Method"
          chips
          small-chips
          outlined
          dense
          persistent-hint
          @change="
            () => {
              payloadChange();
            }
          "
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import EntityAvatar from "@/components/Entity/EntityAvatar";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import { useSnackbar } from "@/composables/snackbar";
import { useSearch } from "@/composables/search";
import { ref, computed } from "@vue/composition-api";

export default {
  name: "StdDivaEntityRelationEditor",
  components: {
    CustomHeader,
    EntityAvatar,
    EntityDetailsLink,
  },
  props: {},
  setup(props, context) {
    const { search, data, loading, error } = useSearch();
    const { snackbar, message, color } = useSnackbar();

    const edgeTypes = [
      "isCreatorOf",
      "isPartOf",
      "isOwnerOf",
      "isPublisherOf",
      "isReviewOf",
      "isSubscriberOf",
      "isAlternativeOf",
      "likes",
      "keywordsSimilarity",
      "textContentSimilarity",
      "isDestroySubjectOf",
      "isDestroyConditionOf",
      "isDestroyActionOf",
      "refersTo",
      "isPreviousVersionOf",
      "acquired",
    ];

    const nodeTypes = [
      "resource",
      "asset",
      "user",
      "publisher",
      "review",
      "history",
      "service",
      "systemEntity",
      "folder",
      "destroyclaim",
    ];

    const evaluationMethods = [
      {
        name: "Relation Exists",
        value: "relationExists",
      },
      {
        name: "Relation does not Exists",
        value: "noRelationExists",
      },
    ];

    const searchFromInput = ref("");
    const searchToInput = ref("");
    const selectedFromEntity = ref(null);
    const selectedToEntity = ref(null);
    const selectedEdgeTypes = ref([]);
    const bidirectional = ref(false);
    const selectedFromNodeTypes = ref([]);
    const selectedToNodeTypes = ref([]);
    const selectedEvaluationMethod = ref("relationExists");

    const disableFromEntity = computed(() => {
      return selectedFromNodeTypes.value.length > 0;
    });
    const disableFromNodeTypes = computed(() => {
      return selectedFromEntity.value !== null;
    });
    const disableToEntity = computed(() => {
      return selectedToNodeTypes.value.length > 0;
    });
    const disableToNodeTypes = computed(() => {
      return selectedToEntity.value !== null;
    });

    const payloadChange = () => {
      context.emit("update:payload", {
        from: selectedFromEntity?.value?.id,
        to: selectedToEntity?.value?.id,
        edgeTypes:
          selectedEdgeTypes.value.length > 0
            ? selectedEdgeTypes.value
            : undefined,
        fromNodeType:
          selectedFromNodeTypes.value.length > 0
            ? selectedFromNodeTypes.value
            : undefined,
        toNodeType:
          selectedToNodeTypes.value.length > 0
            ? selectedToNodeTypes.value
            : undefined,
        bidirectional: bidirectional.value,
        evaluationMethod: selectedEvaluationMethod.value,
      });
    };

    return {
      loading,
      error,
      snackbar,
      message,
      color,
      edgeTypes,
      selectedEdgeTypes,
      nodeTypes,
      selectedFromNodeTypes,
      disableFromNodeTypes,
      selectedToNodeTypes,
      disableToNodeTypes,
      searchFromInput,
      searchToInput,
      bidirectional,
      selectedFromEntity,
      disableFromEntity,
      selectedToEntity,
      disableToEntity,
      searchFromResult: computed(() => [
        ...(data.value?.collection ?? [])
          .map(({ doc }) => doc)
          .filter((doc) => doc.id !== props.id),
      ]),
      searchToResult: computed(() => [
        ...(data.value?.collection ?? [])
          .map(({ doc }) => doc)
          .filter((doc) => doc.id !== props.id),
      ]),
      searchEntities: (input) =>
        search(input, {
          pageSize: 30,
          ...props.query,
          entityType: props.entityType,
        }),
      evaluationMethods,
      selectedEvaluationMethod,
      payloadChange,
    };
  },
};
</script>

<style scoped lang="scss"></style>
