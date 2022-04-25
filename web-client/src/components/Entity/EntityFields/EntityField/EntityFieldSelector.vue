<template>
  <div>
    <slot :viewer="fieldsConfig.viewer" :editor="fieldsConfig.editor"></slot>
  </div>
</template>

<script>
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
import PrimitiveFieldEditor from "@/components/Entity/EntityFields/EntityField/PrimitiveField/PrimitiveFieldEditor";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import PrimitiveFieldViewer from "@/components/Entity/EntityFields/EntityField/PrimitiveField/PrimitiveFieldViewer";
import SelectFieldViewer from "@/components/Entity/EntityFields/EntityField/SelectField/SelectFieldViewer";
import SelectFieldEditor from "@/components/Entity/EntityFields/EntityField/SelectField/SelectFieldEditor";
import { computed } from "@vue/composition-api";
import MarkdownFieldEditor from "@/components/Entity/EntityFields/EntityField/MarkdownField/MarkdownFieldEditor";
import MarkdownFieldViewer from "@/components/Entity/EntityFields/EntityField/MarkdownField/MarkdownFieldViewer";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import BooleanFieldEditor from "@/components/Entity/EntityFields/EntityField/BooleanField/BooleanEditor";
import BooleanFieldViewer from "@/components/Entity/EntityFields/EntityField/BooleanField/BooleanFieldViewer";
import DateFieldViewer from "@/components/Entity/EntityFields/EntityField/DateField/DateFieldViewer";
import DateFieldEditor from "@/components/Entity/EntityFields/EntityField/DateField/DateFieldEditor";
import TextAreaFieldEditor from "@/components/Entity/EntityFields/EntityField/TextAreaField/TextAreaFieldEditor";
import TextAreaFieldViewer from "@/components/Entity/EntityFields/EntityField/TextAreaField/TextAreaFieldViewer";
export default {
  name: "EntityFieldSelector",
  components: {
    TextAreaFieldViewer,
    TextAreaFieldEditor,
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
    type: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const configMap = {
      richText: {
        viewer: MarkdownFieldViewer,
        editor: MarkdownFieldEditor,
      },
      text: {
        viewer: PrimitiveFieldViewer,
        editor: PrimitiveFieldEditor,
      },
      string: {
        viewer: PrimitiveFieldViewer,
        editor: PrimitiveFieldEditor,
      },
      textArea: {
        viewer: TextAreaFieldViewer,
        editor: TextAreaFieldEditor,
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
      fieldsConfig: computed(
        () =>
          configMap[props.type] ?? {
            PrimitiveFieldEditor,
            PrimitiveFieldViewer,
          }
      ),
    };
  },
};
</script>

<style scoped></style>
