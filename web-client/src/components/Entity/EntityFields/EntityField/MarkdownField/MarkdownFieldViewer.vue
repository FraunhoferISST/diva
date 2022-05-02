<template>
  <markdown-viewer v-if="value" :markdown="value" />
  <no-data-state v-else> Add {{ title }} </no-data-state>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import MarkdownViewer from "@/components/Base/MarkdownViewer";
import entityFieldViewerInterface from "@/components/Entity/EntityFields/EntityField/entityFieldViewerInterface";
export default {
  name: "MarkdownFieldViewer",
  inheritAttrs: false,
  components: {
    MarkdownViewer,
    NoDataState,
  },
  props: {
    ...entityFieldViewerInterface,
    value: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
