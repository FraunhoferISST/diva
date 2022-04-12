<template>
  <info-block class="relative" :title="title">
    <template #value>
      <field-editor :data="{ [property]: value }" :on-save="() => testPatch()">
        <template #view="{ state }">
          <slot>
            <template>
              <component
                :is="fieldsConfig.viewer"
                v-bind="{ ...$props, ...$attrs }"
                :value="state[property]"
              />
            </template>
          </slot>
        </template>
        <template #edit="{ setPatch, patch }">
          <component
            :is="fieldsConfig.editor"
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

<script>
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
import PrimitiveFieldEditor from "@/components/Entity/EntityFields/PrimitiveField/PrimitiveFieldEditor";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import PrimitiveFieldViewer from "@/components/Entity/EntityFields/PrimitiveField/PrimitiveFieldViewer";
import SelectFieldViewer from "@/components/Entity/EntityFields/SelectField/SelectFieldViewer";
import SelectFieldEditor from "@/components/Entity/EntityFields/SelectField/SelectFieldEditor";
import { useSnackbar } from "@/composables/snackbar";
import { computed } from "@vue/composition-api";
import MarkdownFieldEditor from "@/components/Entity/EntityFields/MarkdownField/MarkdownFieldEditor";
import MarkdownFieldViewer from "@/components/Entity/EntityFields/MarkdownField/MarkdownFieldViewer";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import DateFieldEditor from "@/components/Entity/EntityFields/DateField/DateFieldEditor";
import DateFieldViewer from "@/components/Entity/EntityFields/DateField/DateFieldViewer";
import BooleanFieldEditor from "@/components/Entity/EntityFields/BooleanField/BooleanEditor";
import BooleanFieldViewer from "@/components/Entity/EntityFields/BooleanField/BooleanFieldViewer";
export default {
  name: "FieldPreview",
  components: {
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
    const configMap = {
      richText: {
        viewer: MarkdownFieldViewer,
        editor: MarkdownFieldEditor,
      },
      text: {
        viewer: PrimitiveFieldViewer,
        editor: PrimitiveFieldEditor,
      },
      date: {
        viewer: DateFieldViewer,
        editor: DateFieldEditor,
      },
      number: {
        viewer: PrimitiveFieldViewer,
        editor: PrimitiveFieldEditor,
      },
      select: {
        viewer: SelectFieldViewer,
        editor: SelectFieldEditor,
      },
      boolean: {
        viewer: BooleanFieldViewer,
        editor: BooleanFieldEditor,
      },
    };
    const { show, message, color, snackbar } = useSnackbar();
    return {
      color,
      message,
      computedValue,
      snackbar,
      fieldsConfig: computed(() => configMap[props.type]),
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
