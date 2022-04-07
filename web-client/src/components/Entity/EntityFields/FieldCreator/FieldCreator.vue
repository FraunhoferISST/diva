<template>
  <div class="field-creator">
    <div class="d-flex justify-center mb-5">
      <switch-slider
        :options="modes"
        :selected.sync="mode"
        :size="80"
        @select="setTab"
      />
    </div>
    <div class="field-creator-content d-flex">
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
                    scope.map(({ value }) => value).join(", ") ||
                    "Applied to all"
                  }}
                </small>
              </v-stepper-step>
              <v-stepper-content step="1">
                <v-container fluid>
                  <field-scope-selector :scope.sync="scope" />
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
          <div class="field-creator-json">
            <pre>
          {{ jsonSchema }}
          </pre
            >
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <div class="field-creator-preview" v-if="isDefinitionValid && isTypeValid">
      <v-container fluid>
        <v-row>
          <v-col cols="12" :md="jsonSchemaUi.fullWidth ? '12' : '4'">
            <field-preview
              id="test"
              :type="jsonSchemaUi.type"
              :title="jsonSchemaEntity.title"
              :property="jsonSchemaEntity.schemaName"
              value="test"
              :options="jsonSchemaUi.options"
              :multiple="jsonSchemaUi.multiple"
              :allowCustom="jsonSchemaUi.allowCustom"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import FieldScopeSelector from "@/components/Entity/EntityFields/FieldCreator/FieldScopeSelector";
import { computed, ref } from "@vue/composition-api";
import FieldTypeSelector from "@/components/Entity/EntityFields/FieldCreator/FieldTypeSelector";
import FieldDefinition from "@/components/Entity/EntityFields/FieldCreator/FieldDefinition";
import FieldPresentation from "@/components/Entity/EntityFields/FieldCreator/FieldPresentation";
import SwitchSlider from "@/components/Base/SwitchSlider";
import FieldPreview from "@/components/Entity/EntityFields/FieldCreator/FieldPreview";
export default {
  name: "FieldCreator",
  components: {
    FieldPreview,
    SwitchSlider,
    FieldPresentation,
    FieldDefinition,
    FieldTypeSelector,
    FieldScopeSelector,
  },
  setup() {
    const mode = ref("Editor");
    const tab = ref(0);
    const step = ref(1);
    const scope = ref([]);
    const type = ref({});
    const definition = ref({});
    const presentation = ref({
      view: "overview",
      position: 10,
      fullwidth: true,
    });

    const editorDataToSchema = (
      editorData = { ...type.value, ...definition.value, ...presentation.value }
    ) => {
      return {
        $schema: "",
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
              options: editorData?.options?.split(","),
              multiple: editorData.multiple,
              fallbackValue: "",
            },
          },
        },
      };
    };
    const jsonSchema = computed(() => editorDataToSchema());
    return {
      scope,
      type,
      definition,
      presentation,
      mode,
      step,
      tab,
      modes: [
        {
          title: "Editor",
          icon: "mode",
        },
        {
          title: "JSON",
          icon: "code",
        },
        /*{
          title: "Both",
          icon: "view_stream",
        },*/
      ],
      jsonSchema,
      jsonSchemaUi: computed(
        () => jsonSchema.value.properties[definition.value.propertyName]?._ui
      ),
      jsonSchemaEntity: computed(() => ({
        title: definition.value.title,
        schemaName: definition.value.propertyName,
        description: definition.value.description,
        entityType: "systemEntity",
        systemEntityType: "schema",
        schema: JSON.stringify(jsonSchema),
        ...(scope.value.length > 0 ? { scope: scope.value } : {}),
      })),
      isScopeValid: computed(() => !!scope.value),
      isTypeValid: computed(() => !!type.value.type),
      isDefinitionValid: computed(
        () => !!(definition.value.propertyName && definition.value.title)
      ),
      isPresentationValid: computed(() => !!presentation.value.view),
      setTab: (index) => (tab.value = index),
    };
  },
};
</script>

<style scoped lang="scss"></style>
