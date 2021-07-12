<template>
  <v-tooltip top :color="setColor">
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script>
import vars from "@/styles/vars.scss";
export default {
  name: "CustomTooltip",
  props: {
    text: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
  },
  computed: {
    setColor() {
      return this.color ? this.color : vars.bgPrimary;
    },
  },
};
</script>

<style scoped></style>
