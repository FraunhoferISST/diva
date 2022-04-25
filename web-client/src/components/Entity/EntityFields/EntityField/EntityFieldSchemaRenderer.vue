<template>
  <entity-field-selector :type="fieldDefinition.type">
    <template #default="{ editor, viewer }">
      <slot
        name="additional"
        :field="fieldDefinition"
        :editor="editor"
        :viewer="viewer"
      ></slot>
      <slot :field="fieldDefinition" :editor="editor" :viewer="viewer">
        <component
          :is="editor"
          v-bind="{ ...$attrs }"
          :property="fieldDefinition.propertyName"
          :value="fieldDefinition.value"
          :title="fieldDefinition.title"
          :options="fieldDefinition.options"
          :allowCustom="fieldDefinition.allowCustom"
          :multiple="fieldDefinition._ui.multiple"
          :min-length="fieldDefinition.minLength"
          :max-length="fieldDefinition.maxLength"
          @update:value="(newVal) => $emit('update:value', newVal)"
        />
      </slot>
    </template>
  </entity-field-selector>
</template>

<script>
import EntityFieldSelector from "@/components/Entity/EntityFields/EntityField/EntityFieldSelector";
import { computed } from "@vue/composition-api";
export default {
  name: "EntityFieldSchemaRenderer",
  components: { EntityFieldSelector },
  props: {
    schemaEntity: {
      type: Object,
      required: true,
    },
    value: {
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const jsonSchemaTypesMap = {
      string: "text",
      integer: "number",
      number: "number",
      boolean: "boolean",
      array: "select",
    };
    return {
      fieldDefinition: computed(() => {
        const schema = props.schemaEntity.schema;
        const propertyName = Object.keys(schema.properties)[0];
        const propDefinition = schema.properties[propertyName];
        const uiDefinition = propDefinition._ui ?? propDefinition?.items?._ui;
        const uiType = uiDefinition?.type;
        let type = jsonSchemaTypesMap[propDefinition.type];
        let options;
        if (uiType) {
          type = uiType;
          options =
            uiType.options ??
            propDefinition.enum ??
            propDefinition?.items?.enum ??
            [];
        } else {
          if (propDefinition.enum) {
            type = "select";
          }
          if (propDefinition.format === "date-time") {
            type = "date";
          }
          options = propDefinition.enum ?? propDefinition?.items?.enum ?? [];
        }
        return {
          propertyName,
          title: props.schemaEntity.title,
          description: props.schemaEntity.description,
          ...propDefinition,
          _ui: uiDefinition ?? {},
          type,
          options,
          value:
            props.value ??
            uiDefinition?.fallbackValue ??
            schema.default ??
            schema?.items?.default ??
            "",
        };
      }),
    };
  },
};
</script>

<style scoped></style>
