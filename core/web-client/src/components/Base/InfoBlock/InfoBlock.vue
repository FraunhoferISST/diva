<template>
  <v-row v-bind="$attrs">
    <v-col cols="12" class="pb-1">
      <slot name="title">
        <info-block-title>{{ title }}</info-block-title>
      </slot>
    </v-col>
    <v-col cols="12" class="pt-1 info-block-value">
      <slot name="value">
        <info-block-value>{{ value }}</info-block-value>
      </slot>
    </v-col>
  </v-row>
</template>

<script>
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
export default {
  name: "InfoBlock",
  components: { InfoBlockValue, InfoBlockTitle },
  props: {
    title: {
      type: String,
      required: false,
    },
    value: {
      required: false,
    },
  },
};
</script>

<style scoped lang="scss">
.info-block-value {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>
