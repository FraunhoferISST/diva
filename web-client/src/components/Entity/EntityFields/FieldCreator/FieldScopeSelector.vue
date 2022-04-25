<template>
  <check-box-card-group :items="scopesOptions" :selected.sync="computedScope">
    <template #default="{ toggle, selectedIndices }">
      <v-container fluid class="pa-0">
        <v-row dense>
          <v-col cols="12" md="6">
            <check-box-card-item
              :active="selectedIndices.includes(0)"
              title="Apply to all"
              @clicked="() => toggle(0)"
            >
              Will be applied to all entities
            </check-box-card-item>
          </v-col>
          <v-col cols="12" md="6">
            <check-box-card-item
              :active="selectedIndices.includes(1)"
              title="For all files"
              @clicked="() => toggle(1)"
            >
              This option makes the new field available for all file entities
              like PDF, CSV etc.
            </check-box-card-item>
          </v-col>
          <v-col cols="12" v-if="properties.length > 0">
            <check-box-card-item
              :active="selectedIndices.includes(2)"
              title="Custom Option"
              @clicked="() => toggle(2)"
            >
              You can customize the scope of the new field
              <v-container
                fluid
                class="px-0"
                v-if="scopesOptions[2].value.scope.length > 0"
              >
                <v-row
                  dense
                  v-for="(scope, i) in scopesOptions[2].value.scope"
                  :key="i"
                >
                  <v-col cols="12" sm="6" class="mt-2">
                    <v-autocomplete
                      v-model="scope.key"
                      :items="scopeProperties"
                      outlined
                      dense
                      chips
                      small-chips
                      label="Scope property"
                      hide-details
                      :disabled="!selectedIndices.includes(2)"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" class="d-flex mt-2">
                    <entity-field-schema-renderer
                      class="full-width"
                      v-if="getSelectedProperty(scope.key)"
                      :schema-entity="getSelectedProperty(scope.key)"
                      :value="scope.value"
                      @update:value="(newValue) => (scope.value = newValue)"
                    />
                    <v-btn
                      dense
                      icon
                      color="error"
                      class="ml-2"
                      :disabled="!selectedIndices.includes(2)"
                      @click="() => removeCustomScope(i)"
                      v-if="scopesOptions[2].value.scope.length > 1"
                    >
                      <v-icon small> close </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
              <div>
                <v-btn
                  icon
                  dense
                  color="primary"
                  class="mt-3"
                  :disabled="!selectedIndices.includes(2)"
                  @click="addCustomScope"
                >
                  <v-icon dense> add </v-icon>
                </v-btn>
              </div>
            </check-box-card-item>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </check-box-card-group>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import CheckBoxCardGroup from "@/components/Base/CheckBoxCardGroup";
import CheckBoxCardItem from "@/components/Base/CheckBoxCardItem";
import EntityFieldSchemaRenderer from "@/components/Entity/EntityFields/EntityField/EntityFieldSchemaRenderer";

export default {
  name: "FieldScopeSelector",
  props: {
    scope: {
      type: Array,
      required: true,
    },
    properties: {
      type: Array,
      required: true,
    },
  },
  components: {
    EntityFieldSchemaRenderer,
    CheckBoxCardItem,
    CheckBoxCardGroup,
  },
  setup(props, { emit }) {
    const computedScope = computed({
      get() {
        return props.scope;
      },
      set(val) {
        return emit("update:scope", val?.scope ?? []);
      },
    });
    const scopesOptions = ref([
      {
        title: "Apply to all",
        description: "Will be applied to all entities",
        value: { scope: [] },
        selected: props.scope.length === 0,
      },
      {
        title: "For all files",
        description:
          "This option makes the new field available for all file entities like PDF, CSV etc.",
        selected: false,
        value: {
          scope: [{ key: "resourceType", value: "file" }],
        },
      },
      {
        title: "Custom option",
        description: "You can customize the scope of the new field",
        selected: props.scope.length > 0,
        value: {
          scope: props.scope,
        },
      },
    ]);
    const addCustomScope = () => {
      if (
        scopesOptions.value[2].value.scope.every(
          ({ key, value }) => key && value
        )
      ) {
        scopesOptions.value[2].value.scope.push({ key: "", value: "" });
      }
    };
    const removeCustomScope = (index) =>
      scopesOptions.value[2].value.scope.splice(index, 1);
    const getSelectedProperty = (propertyName) => {
      return props.properties.filter(
        ({ propertyName: propName }) => propName === propertyName
      )[0];
    };
    return {
      scopeProperties: computed(() =>
        props.properties
          .filter(({ schema: { properties } }) => {
            const prop = properties[Object.keys(properties)[0]];
            return (
              prop.type !== "object" &&
              prop?.items?.type !== "object" &&
              prop?.items?.type !== "array"
            );
          })
          .map(({ propertyName }) => propertyName)
      ),
      scopesOptions,
      computedScope,
      addCustomScope,
      removeCustomScope,
      getSelectedProperty,
    };
  },
};
</script>

<style scoped></style>
