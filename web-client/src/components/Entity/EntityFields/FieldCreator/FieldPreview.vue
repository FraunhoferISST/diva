<template>
  <entity-field-selector :type="type">
    <template #default="{ editor, viewer }">
      <info-block class="relative" :title="title">
        <template #value>
          <field-editor
            :data="{ [property]: value }"
            :on-save="() => testPatch()"
          >
            <template #view="{ state }">
              <component
                :is="viewer"
                v-bind="{ ...$props, ...$attrs }"
                :value="state[property]"
              />
            </template>
            <template #edit="{ setPatch, patch }">
              <component
                :is="editor"
                v-bind="{ ...$props, ...$attrs }"
                :property="property"
                :value="patch[property]"
                :title="title"
                @update:value="(newValue) => setPatch({ [property]: newValue })"
              />
            </template>
          </field-editor>
          <v-snackbar
            height="50"
            absolute
            bottom
            text
            rounded
            v-model="snackbar"
            :color="color"
            :timeout="4000"
          >
            {{ message }}
          </v-snackbar>
        </template>
      </info-block>
    </template>
  </entity-field-selector>
</template>

<script>
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
import PrimitiveFieldEditor from "@/components/Entity/EntityFields/EntityField/PrimitiveField/PrimitiveFieldEditor";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import PrimitiveFieldViewer from "@/components/Entity/EntityFields/EntityField/PrimitiveField/PrimitiveFieldViewer";
import SelectFieldViewer from "@/components/Entity/EntityFields/EntityField/SelectField/SelectFieldViewer";
import SelectFieldEditor from "@/components/Entity/EntityFields/EntityField/SelectField/SelectFieldEditor";
import { useSnackbar } from "@/composables/snackbar";
import { computed } from "@vue/composition-api";
import MarkdownFieldEditor from "@/components/Entity/EntityFields/EntityField/MarkdownField/MarkdownFieldEditor";
import MarkdownFieldViewer from "@/components/Entity/EntityFields/EntityField/MarkdownField/MarkdownFieldViewer";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import DateFieldEditor from "@/components/Entity/EntityFields/EntityField/DateField/DateFieldEditor";
import DateFieldViewer from "@/components/Entity/EntityFields/EntityField/DateField/DateFieldViewer";
import BooleanFieldEditor from "@/components/Entity/EntityFields/EntityField/BooleanField/BooleanEditor";
import BooleanFieldViewer from "@/components/Entity/EntityFields/EntityField/BooleanField/BooleanFieldViewer";
import EntityFieldSelector from "@/components/Entity/EntityFields/EntityField/EntityFieldSelector";
export default {
  name: "FieldPreview",
  components: {
    EntityFieldSelector,
    BooleanFieldViewer,
    BooleanFieldEditor,
    DateFieldViewer,
    DateFieldEditor,
    InfoBlock,
    MarkdownFieldViewer,
    MarkdownFieldEditor,
    SelectFieldEditor,
    SelectFieldViewer,
    PrimitiveFieldViewer,
    InfoBlockValue,
    InfoBlockTitle,
    PrimitiveFieldEditor,
    FieldEditor,
  },
  props: {
    property: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number, Boolean, Array, Object],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const computedValue = computed({
      get: () => props.value,
      set: (val) => emit("update:value", val),
    });
    const { show, message, color, snackbar } = useSnackbar();
    return {
      color,
      message,
      computedValue,
      snackbar,
      show,
      testPatch: () =>
        new Promise((resolve) => resolve()).then(() =>
          show("This is how the test patch looks like")
        ),
    };
  },
};
</script>

<style scoped></style>
