<template>
  <data-viewer :loading="loading" :error="error">
    <div class="field-creator">
      <div class="d-flex justify-center mb-5">
        <switch-slider
          :options="modes"
          :selected.sync="mode"
          :size="80"
          @select="setTab"
        />
      </div>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <div class="field-creator-editor">
            <v-stepper
              v-model="step"
              vertical
              class="elevation-0 pb-0"
              non-linear
            >
              <v-stepper-step
                step="1"
                :complete="isScopeValid"
                :color="isScopeValid ? '#20B2AA' : 'primary'"
                editable
                :edit-icon="isScopeValid ? 'done' : 'edit'"
              >
                Define field scope
                <small>
                  {{
                    _scope.map(({ value }) => value).join(", ") ||
                    "Applied to all"
                  }}
                </small>
              </v-stepper-step>
              <v-stepper-content step="1">
                <v-container fluid>
                  <field-scope-selector
                    :scope.sync="_scope"
                    :properties="allProperties"
                  />
                </v-container>
              </v-stepper-content>

              <v-stepper-step
                :edit-icon="isTypeValid ? 'done' : 'edit'"
                :color="isTypeValid ? '#20B2AA' : 'primary'"
                step="2"
                :complete="isTypeValid"
                editable
              >
                Choose a field type
                <small>
                  {{ type.uiType }}
                </small>
              </v-stepper-step>
              <v-stepper-content step="2">
                <v-container fluid>
                  <field-type-selector :type.sync="type" />
                </v-container>
              </v-stepper-content>

              <v-stepper-step
                :edit-icon="isDefinitionValid ? 'done' : 'edit'"
                :color="isDefinitionValid ? '#20B2AA' : 'primary'"
                step="3"
                editable
                :complete="isDefinitionValid"
              >
                Define field properties
                <small>
                  {{ definition.propertyName }}
                </small>
              </v-stepper-step>
              <v-stepper-content step="3">
                <v-container fluid>
                  <field-definition
                    :description.sync="definition.description"
                    :title.sync="definition.title"
                    :property-name.sync="definition.propertyName"
                  />
                </v-container>
              </v-stepper-content>

              <v-stepper-step
                :edit-icon="isPresentationValid ? 'done' : 'edit'"
                :color="isPresentationValid ? '#20B2AA' : 'primary'"
                step="4"
                editable
                :complete="isPresentationValid"
              >
                Adjust a field presentation
                <small>
                  {{ presentation.view }}, {{ presentation.position }},
                  {{ presentation.fullWidth ? "full width" : "1/3 width" }}
                </small>
              </v-stepper-step>
              <v-stepper-content step="4">
                <v-container fluid>
                  <field-presentation :presentation.sync="presentation" />
                </v-container>
              </v-stepper-content>
            </v-stepper>
          </div>
        </v-tab-item>
        <v-tab-item>
          <field-schema
            :schema="jsonSchemaEntity"
            @applySchema="schemaToEditorData"
          />
        </v-tab-item>
      </v-tabs-items>
      <div class="field-creator-preview pb-5">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="12">
              <custom-header>Field preview</custom-header>
            </v-col>
            <v-col
              v-if="isDefinitionValid && isTypeValid"
              cols="12"
              :md="jsonSchemaUi.fullWidth ? '12' : '4'"
            >
              <field-preview
                id="test"
                :type="jsonSchemaUi.type"
                :title="jsonSchemaEntity.title"
                :property="jsonSchemaEntity.schemaName"
                :value="type.testValue"
                :options="jsonSchemaUi.options"
                :multiple="jsonSchemaUi.multiple"
                :allowCustom="jsonSchemaUi.allowCustom"
              />
            </v-col>
            <v-col cols="12" v-else>
              <no-data-state>
                Complete the steps to see the new field preview
              </no-data-state>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </data-viewer>
</template>

<script>
import FieldScopeSelector from "@/components/Entity/EntityFields/FieldCreator/FieldScopeSelector";
import { computed, ref, watch } from "@vue/composition-api";
import FieldTypeSelector from "@/components/Entity/EntityFields/FieldCreator/FieldTypeSelector";
import FieldDefinition from "@/components/Entity/EntityFields/FieldCreator/FieldDefinition";
import FieldPresentation from "@/components/Entity/EntityFields/FieldCreator/FieldPresentation";
import SwitchSlider from "@/components/Base/SwitchSlider";
import FieldPreview from "@/components/Entity/EntityFields/FieldCreator/FieldPreview";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useSchema } from "@/composables/schema";
import CustomHeader from "@/components/Base/CustomHeader";
import NoDataState from "@/components/Base/NoDataState";
import FieldSchema from "@/components/Entity/EntityFields/FieldCreator/FieldSchema";
export default {
  name: "FieldCreator",
  components: {
    FieldSchema,
    NoDataState,
    CustomHeader,
    DataViewer,
    FieldPreview,
    SwitchSlider,
    FieldPresentation,
    FieldDefinition,
    FieldTypeSelector,
    FieldScopeSelector,
  },
  props: {
    schemaEntity: {
      type: Object,
      default: () => {},
    },
    scope: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const { getAllSchemata, loading, error } = useSchema();
    const allSchemata = ref([]);
    getAllSchemata().then((schemata) => (allSchemata.value = schemata));
    const mode = ref("Editor");
    const tab = ref(0);
    const step = ref(1);
    const _scope = ref(props.scope);
    const type = ref({});
    const definition = ref({
      propertyName: "",
      title: "",
      description: "",
    });
    const presentation = ref({
      view: "overview",
      position: 10,
      fullwidth: true,
    });

    const schemaToEditorData = (schemaEntity) => {
      const {
        scope = [],
        schema: { properties },
      } = schemaEntity;
      const propertyName = Object.keys(properties)[0];
      const {
        schema: {
          properties: {
            [propertyName]: {
              type: receivedType,
              _ui: { view, position, fullWidth, ...rest },
            },
          },
        },
      } = schemaEntity;
      const title = schemaEntity.title ?? properties[propertyName].title;
      const description =
        schemaEntity.description ?? properties[propertyName].description;
      type.value = {
        ...rest,
        uiType: rest.type,
        testValue: rest.fallbackValue,
        type: receivedType,
        options: rest.options?.join(",") ?? "",
      };
      scope.value = schemaEntity.scope;
      definition.value = {
        ...definition.value,
        propertyName,
        title,
        description,
      };
      presentation.value = {
        view,
        position,
        fullWidth,
      };
    };

    if (props.schemaEntity && Object.keys(props.schemaEntity).length > 0) {
      schemaToEditorData(props.schemaEntity);
    }

    const editorDataToSchema = (
      editorData = { ...type.value, ...definition.value, ...presentation.value }
    ) => {
      return {
        $schema: "https://json-schema.org/draft/2019-09/schema",
        title: editorData.title,
        description: editorData.description,
        type: "object",
        properties: {
          [editorData.propertyName]: {
            title: editorData.title,
            description: editorData.description,
            type:
              editorData.uiType === "select" && editorData.multiple
                ? "array"
                : editorData.type,
            ...(editorData.options && !editorData.allowCustom
              ? { enumeration: editorData.options.split(",") }
              : {}),
            ...(editorData.uiType === "select" && editorData.multiple
              ? { items: { type: "string" } }
              : {}),
            _ui: {
              view: editorData.view,
              position: editorData.position,
              allowCustom: editorData.allowCustom,
              fullWidth: editorData.fullWidth,
              type: editorData?.uiType,
              options: editorData?.options
                ? editorData?.options?.split(",")
                : [],
              multiple: editorData.multiple,
              fallbackValue: "",
            },
          },
        },
      };
    };
    const jsonSchema = computed(() => editorDataToSchema());
    const jsonSchemaEntity = computed(() => ({
      title: definition.value.title,
      schemaName: definition.value.propertyName,
      description: definition.value.description,
      entityType: "systemEntity",
      systemEntityType: "schema",
      editable: true,
      schema: jsonSchema.value,
      ...(_scope.value.length > 0 ? { scope: _scope.value } : {}),
    }));
    watch(jsonSchemaEntity, () => emit("edit", jsonSchemaEntity.value));
    return {
      loading,
      error,
      _scope,
      type,
      definition,
      presentation,
      mode,
      step,
      tab,
      allSchemata,
      allProperties: computed(() =>
        allSchemata.value
          .filter(({ schemaName }) => schemaName !== "entity")
          .map(({ schemaName, schema, ...rest }) => ({
            propertyName: schemaName,
            ...rest,
            schema: JSON.parse(schema),
          }))
      ),
      modes: [
        {
          title: "Editor",
          icon: "mode",
        },
        {
          title: "JSON",
          icon: "code",
        },
      ],
      jsonSchema,
      jsonSchemaUi: computed(
        () => jsonSchema.value.properties[definition.value.propertyName]?._ui
      ),
      jsonSchemaEntity,
      isScopeValid: computed(() => !!_scope.value),
      isTypeValid: computed(() => !!type.value.type),
      isDefinitionValid: computed(
        () => !!(definition.value.propertyName && definition.value.title)
      ),
      isPresentationValid: computed(() => !!presentation.value.view),
      setTab: (index) => (tab.value = index),
      schemaToEditorData,
    };
  },
};
</script>

<style scoped lang="scss"></style>
