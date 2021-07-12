<template>
  <vue-ellipse-progress
    :progress="progress || 0"
    :no-data="!isValidData"
    :size="size"
    font-size="1.3rem"
    color="#7579ff"
    :thickness="3"
    :empty-thickness="0"
    emptyColor="transparent"
    :emptyColorFill="emptyColorFill"
    fontColor="white"
    legendClass="progress-circle-legend"
    animation="rs 1000 800"
  >
    <template #legend-value>
      <slot name="legend-value"></slot>
    </template>
    <template #legend-caption v-if="!isValidData">
      <p class="ma-0" style="color: #adadad; font-size: 1.4rem">N/A</p>
    </template>
  </vue-ellipse-progress>
</template>
<script>
const waveColor = "#004aef";
export default {
  name: "ProgressCircle",
  props: {
    progress: {
      required: true,
    },
    value: {
      type: Number,
      required: false,
    },
    size: {
      type: Number,
      required: false,
      default: 200,
    },
  },
  data: () => ({
    emptyColorFill: {
      radial: true,
      direction: "",
      colors: [
        {
          color: waveColor,
          offset: "60",
          opacity: "0.3",
        },
        {
          color: waveColor,
          offset: "60",
          opacity: "0.2",
        },
        {
          color: waveColor,
          offset: "80",
          opacity: "0.1",
        },
        {
          color: waveColor,
          offset: "80",
          opacity: "0.06",
        },
        {
          color: waveColor,
          offset: "100",
          opacity: "0.03",
        },
      ],
    },
  }),
  computed: {
    isValidData() {
      return this.progress >= 0;
    },
  },
};
</script>

<style lang="scss"></style>
