<template>
  <info-block-value v-if="typeof value !== 'undefined'">
    <CodeEditor
      :value="JSON.stringify(JSON.parse(value), null, 3)"
      :languages="[['json', 'JSON']]"
      :read_only="true"
      :copy_code="false"
      width="100%"
    ></CodeEditor>
  </info-block-value>
  <no-data-state v-else>
    <span v-if="editable">Add {{ title }}</span>
    <span v-else>Value of {{ title }} is not editable</span>
  </no-data-state>
</template>

<script>
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import NoDataState from "@/components/Base/NoDataState";
import entityFieldViewerInterfaces from "@/components/Entity/EntityFields/EntityField/entityFieldViewerInterface";
import CodeEditor from "simple-code-editor";

export default {
  name: "JsonFieldViewer",
  inheritAttrs: false,
  components: {
    NoDataState,
    InfoBlockValue,
    CodeEditor,
  },
  props: {
    ...entityFieldViewerInterfaces,
    value: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss"></style>
