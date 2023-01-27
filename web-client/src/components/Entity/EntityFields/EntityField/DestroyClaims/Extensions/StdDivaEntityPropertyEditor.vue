<template>
  <v-container class="pa-0">
    <v-row>
      <v-col>
        <custom-header> DIVA Entity Property (std:divaProperty) </custom-header>
      </v-col>
    </v-row>
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
          prepend-inner-icon="mdi-key"
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
        <v-text-field
          class="pt-3"
          v-if="typeOfField === 'string'"
          v-model="fieldValue"
          outlined
          dense
          label="input value"
          prepend-inner-icon="mdi-database"
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
          label="input value"
          prepend-inner-icon="mdi-database"
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
          :label="`Must be ${fieldValue}`"
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
    <v-row>
      <v-col md="6">
        <v-radio-group v-model="has" @change="payloadChange" :column="false">
          <v-radio
            label="Apply when DIVA entity has Property"
            value="true"
          ></v-radio>
          <v-radio
            label="Apply when DIVA entity not has Property"
            value="false"
          ></v-radio>
        </v-radio-group>
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

    const searchInput = ref("");
    const selectedEntity = ref({});
    const schemaData = ref([]);
    const selectedField = ref("");
    const typeOfField = ref(null);
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
        fieldValue.value !== null
      ) {
        context.emit("update:payload", {
          entityId: selectedEntity.value.id,
          field: selectedField.value,
          value: fieldValue.value,
          has: has.value === "true" ? true : false,
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
      requestSchema,
    };
  },
};
</script>

<style scoped lang="scss"></style>
