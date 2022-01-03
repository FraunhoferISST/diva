<template>
  <no-data-state
    v-if="!description"
    text="You can provide a description here"
  />
  <markdown-viewer v-else :markdown="description" />
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import MarkdownViewer from "@/components/Base/MarkdownViewer";
export default {
  name: "GeneralDescription",
  components: { MarkdownViewer, NoDataState },
  props: {
    description: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.general-description {
  @include font-style(16px, $font_body, bold, $font_secondary_color);
  white-space: pre-line;
}
</style>
