<template>
  <vue-ellipse-progress
    :progress="progress || 0"
    :no-data="!isValidData"
    :size="size"
    font-size="1rem"
    :thickness="2"
    color="#2d68fc"
    emptyColor="transparent"
    animation="rs 1000 800"
  >
    <template #legend-value>
      <slot name="legend-value"></slot>
    </template>
    <template #legend-caption v-if="!isValidData">
      <p class="ma-0" style="color: #adadad; font-size: 1rem">N/A</p>
    </template>
  </vue-ellipse-progress>
</template>
<script>
export default {
  name: "TableProgressCircle",
  props: {
    progress: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: false,
      default: 35,
    },
  },
  computed: {
    isValidData() {
      return this.progress >= 0;
    },
  },
};
</script>

<style lang="scss"></style>
