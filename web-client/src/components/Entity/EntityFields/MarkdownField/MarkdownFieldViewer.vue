<template>
  <markdown-viewer v-if="value" :markdown="value" />
  <no-data-state v-else> Add {{ title }} </no-data-state>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import MarkdownViewer from "@/components/Base/MarkdownViewer";
export default {
  name: "MarkdownFieldViewer",
  components: {
    MarkdownViewer,
    NoDataState,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
