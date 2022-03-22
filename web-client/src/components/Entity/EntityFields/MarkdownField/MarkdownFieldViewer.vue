<template>
  <info-block>
    <template #value>
      <markdown-viewer v-if="value" :markdown="value" />
      <no-data-state v-else> Add {{ title }} </no-data-state>
    </template>
  </info-block>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import MarkdownViewer from "@/components/Base/MarkdownViewer";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
export default {
  name: "MarkdownFieldViewer",
  components: {
    InfoBlock,
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
