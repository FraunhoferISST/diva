<template>
  <vue-ellipse-progress
    :progress="progress"
    :size="size"
    font-size="0.8rem"
    font-color="#17196d"
    color="#7579ff"
    thickness="3%"
    emptyColor="rgba(117, 121, 255, 0.1)"
    emptyColorFill="transparent"
    animation="rs 1000 800"
  >
    <template v-slot:legend-value>
      <span>
        <slot name="legend-value"></slot>
      </span>
    </template>
    <template v-slot:legend-caption>
      <div slot="legend-caption">
        <slot name="caption"></slot>
      </div>
    </template>
  </vue-ellipse-progress>
</template>
<script>
export default {
  name: "ProgressCircleSimple",
  props: {
    progress: {
      type: Number,
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
};
</script>

<style lang="scss"></style>
