<template>
  <entity-field-schema-renderer :schema-entity="fieldSchema">
    <template #default="{ field, editor, viewer }">
      <info-block :title="field.title">
        <template #title v-if="field.description">
          <info-block-title class="d-flex justify-space-between">
            {{ field.title }}
            <template #info>
              <v-tooltip top open-delay="600" max-width="400px">
                <template #activator="{ on, attrs }">
                  <v-icon color="primary" dense v-bind="attrs" v-on="on">
                    info_outline
                  </v-icon>
                </template>
                <span>{{ field.description }}</span>
              </v-tooltip>
            </template>
          </info-block-title>
        </template>
        <template #value>
          <field-editor
            :editable="!!field.isPatchable"
            :data="{ [field.propertyName]: value }"
            :on-save="patchAndMutate"
          >
            <template #view="{ state }">
              <component
                :is="viewer"
                :title="field.title"
                :value="state[field.propertyName]"
                :editable="field.isPatchable"
              />
            </template>
            <template #edit="{ setPatch, patch }">
              <component
                :is="editor"
                :property="field.propertyName"
                :value="patch[field.propertyName]"
                :title="field.title"
                :options="field.options"
                :allowCustom="field._ui.allowCustom"
                :multiple="field._ui.multiple"
                :min-length="field.minLength"
                :max-length="field.maxLength"
                @update:value="
                  (newValue) => setPatch({ [field.propertyName]: newValue })
                "
              />
            </template>
          </field-editor>
        </template>
      </info-block>
    </template>
  </entity-field-schema-renderer>
</template>

<script>
import { useEntity } from "@/composables/entity";
import { computed } from "@vue/composition-api";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import EntityFieldSelector from "@/components/Entity/EntityFields/EntityField/EntityFieldSelector";
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
import EntityFieldSchemaRenderer from "@/components/Entity/EntityFields/EntityField/EntityFieldSchemaRenderer";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
export default {
  name: "EntityField",
  components: {
    InfoBlockTitle,
    EntityFieldSchemaRenderer,
    FieldEditor,
    EntityFieldSelector,
    InfoBlock,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    fieldSchema: {
      type: Object,
      required: true,
    },
    value: {
      type: [String, Number, Array, Boolean, Date, Object],
      required: true,
    },
    mutateSource: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, { emit }) {
    const computedValue = computed({
      get: () => props.value,
      set: (val) => emit("update:value", val),
    });
    const { patch, patchLoading, patchError } = useEntity(props.id, {
      reactive: false,
    });
    const patchAndMutate = (patchData) =>
      patch(patchData).then(() => {
        if (patchError.value) {
          throw patchError.value;
        }
        if (props.mutateSource) {
          computedValue.value = patchData[props.fieldSchema.propertyName];
        }
      });
    return {
      patchLoading,
      patchAndMutate,
    };
  },
};
</script>

<style scoped></style>
