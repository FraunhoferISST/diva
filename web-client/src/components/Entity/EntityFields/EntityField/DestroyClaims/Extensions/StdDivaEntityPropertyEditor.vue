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
          help of the metadata stored in DIVA.
          <br />
          First, you need to select an entity. Afterwards, it is possible to
          select one of the available metadata fields. Finally, a comparison
          operator and the value to be compared must be set.
        </v-alert></v-col
      ></v-row
    >
    <v-row>
      <v-col md="4">
        <v-autocomplete
          dense
          class="custom-autocomplete pt-3"
          v-model="selectedEntity"
          :loading="loading"
          :items="searchResult"
          :search-input.sync="searchInput"
          chips
          outlined
          placeholder="Search entities"
          background-color="white"
          color="info"
          label="Select Entity"
          hide-selected
          hide-details
          cache-items
          item-text="title"
          item-value="id"
          clearable
          return-object
          @update:search-input="() => searchEntities(searchInput)"
          @change="requestSchema"
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
      <v-col md="4" v-if="!keyDisabled">
        <v-autocomplete
          class="pt-3"
          v-model="selectedField"
          :items="schemaData"
          item-text="title"
          item-value="schemaName"
          outlined
          dense
          chips
          small-chips
          hide-details
          label="Select Property"
          :disabled="keyDisabled"
          @change="
            () => {
              payloadChange();
              getTypeOfField();
            }
          "
        ></v-autocomplete>
      </v-col>
      <v-col md="4" v-if="!valueDisabled">
        <v-select
          v-model="selectedOperator"
          class="pt-3"
          :items="computedOperators"
          item-text="display"
          item-value="value"
          outlined
          dense
          label="Select Operator"
          @change="
            () => {
              payloadChange();
            }
          "
        ></v-select>
      </v-col>
      <v-col md="4" v-if="!valueDisabled">
        <v-text-field
          class="pt-3"
          v-if="typeOfField === 'string'"
          v-model="fieldValue"
          outlined
          dense
          label="Enter Value"
          :disabled="valueDisabled"
          @change="
            () => {
              payloadChange();
            }
          "
        ></v-text-field>
        <v-text-field
          class="pt-3"
          v-else-if="typeOfField === 'number'"
          v-model="fieldValue"
          outlined
          dense
          label="Enter Value"
          type="number"
          :disabled="valueDisabled"
          @change="
            () => {
              payloadChange();
            }
          "
        ></v-text-field>
        <v-switch
          v-else-if="typeOfField === 'boolean'"
          v-model="fieldValue"
          inset
          dense
          :label="`${fieldValue ? 'set' : 'not set'}`"
          @change="
            () => {
              payloadChange();
            }
          "
        ></v-switch>
        <v-alert
          class="mt-3"
          v-else
          border="left"
          colored-border
          color="deep-purple accent-4"
          elevation="2"
          dense
          >field type currently not supported</v-alert
        >
      </v-col>
    </v-row>
    <v-row v-if="selectedOperator === 'matches'">
      <v-col md="12">
        <v-alert border="left" colored-border type="warning" elevation="2">
          A regular expression can be specified here. The regex should be
          JavaScript compliant. The pattern must not been enclosed between
          slashes!
        </v-alert>
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
import { useSchema } from "@/composables/schema";
import { ref, computed } from "@vue/composition-api";

export default {
  name: "StdDivaEntityPropertyEditor",
  components: {
    CustomHeader,
    EntityAvatar,
    EntityDetailsLink,
  },
  props: {},
  setup(props, context) {
    const { search, data, loading, error } = useSearch();
    const { snackbar, message, color } = useSnackbar();
    const { load: loadSchema, schema } = useSchema();

    const operators = [
      {
        value: "equal",
        display: "equals",
        types: ["string", "number", "boolean"],
      },
      {
        value: "not equal",
        display: "does not equal",
        types: ["string", "number", "boolean"],
      },
      { value: "includes", display: "includes", types: ["string"] },
      { value: "matches", display: "matches", types: ["string"] },
    ];

    const searchInput = ref("");
    const selectedEntity = ref({});
    const schemaData = ref([]);
    const selectedField = ref("");
    const typeOfField = ref(null);
    const selectedOperator = ref(null);
    const fieldValue = ref(null);
    const has = ref("true");

    const keyDisabled = computed(() => {
      return !(selectedEntity.value !== null && "id" in selectedEntity?.value);
    });

    const valueDisabled = computed(() => {
      return !(selectedField.value !== null && selectedField.value !== "");
    });

    const getTypeOfField = () => {
      if (selectedField.value !== null && selectedField.value !== "") {
        typeOfField.value =
          schema.value[selectedField.value].schema.properties[
            selectedField.value
          ].type;
        if (typeOfField.value === "string") {
          fieldValue.value = "";
        } else if (typeOfField.value === "number") {
          fieldValue.value = 0;
        } else if (typeOfField.value === "boolean") {
          fieldValue.value = false;
        } else {
          fieldValue.value = null;
        }
      }
    };

    const computedOperators = computed(() => {
      return operators.filter((o) => o.types.includes(typeOfField.value));
    });

    const requestSchema = async () => {
      if (selectedEntity.value !== null && "id" in selectedEntity.value) {
        await loadSchema(selectedEntity.value);
        schemaData.value = Object.values(schema.value).map((v) => v);
      }
    };

    const payloadChange = () => {
      if (
        selectedEntity.value !== null &&
        "id" in selectedEntity.value &&
        selectedField.value !== null &&
        selectedOperator.value !== null &&
        fieldValue.value !== null
      ) {
        context.emit("update:payload", {
          entityId: selectedEntity.value.id,
          field: selectedField.value,
          operator: selectedOperator,
          value: fieldValue.value,
        });
      } else {
        context.emit("update:payload", null);
      }
    };

    return {
      loading,
      error,
      snackbar,
      message,
      color,
      searchInput,
      has,
      payloadChange,
      keyDisabled,
      valueDisabled,
      selectedEntity,
      searchResult: computed(() => [
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
      schemaData,
      selectedField,
      fieldValue,
      getTypeOfField,
      typeOfField,
      selectedOperator,
      computedOperators,
      requestSchema,
    };
  },
};
</script>

<style scoped lang="scss"></style>
