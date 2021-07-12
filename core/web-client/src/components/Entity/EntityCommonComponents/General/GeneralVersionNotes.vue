<template>
  <no-data-state
    v-if="!versionInfo"
    text="You can provide a version notes here"
  >
  </no-data-state>
  <info-block-value v-else>
    {{ versionInfo }}
  </info-block-value>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
export default {
  name: "GeneralVersionNotes",
  components: { InfoBlockValue, NoDataState },
  props: {
    versionInfo: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss"></style>
