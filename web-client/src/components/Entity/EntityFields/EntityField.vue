<template>
  <info-block :title="title">
    <template #value>
      <field-editor :data="{ [property]: value }" :on-save="patchAndMutate">
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
import { useEntity } from "@/composables/entity";
import { computed } from "@vue/composition-api";
import MarkdownFieldEditor from "@/components/Entity/EntityFields/MarkdownField/MarkdownFieldEditor";
import MarkdownFieldViewer from "@/components/Entity/EntityFields/MarkdownField/MarkdownFieldViewer";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import BooleanFieldEditor from "@/components/Entity/EntityFields/BooleanField/BooleanEditor";
import BooleanFieldViewer from "@/components/Entity/EntityFields/BooleanField/BooleanFieldViewer";
import DateFieldViewer from "@/components/Entity/EntityFields/DateField/DateFieldViewer";
import DateFieldEditor from "@/components/Entity/EntityFields/DateField/DateFieldEditor";
export default {
  name: "EntityField",
  components: {
    BooleanFieldViewer,
    BooleanFieldEditor,
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
    id: {
      type: String,
      required: true,
    },
    property: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number, Array, Boolean, Date, Object],
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
          computedValue.value = patchData[props.property];
        }
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
    return {
      patchLoading,
      fieldsConfig: computed(() => configMap[props.type]),
      patchAndMutate,
    };
  },
};
</script>

<style scoped></style>
