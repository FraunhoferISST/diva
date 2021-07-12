<template>
  <div class="chart-container" :style="styles">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ChartContainer",
  props: {
    height: {
      type: String,
      default: "300",
    },
  },
  computed: {
    styles() {
      return {
        "--chart-container-height": `${this.height}px`,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.chart-container {
  & > div {
    min-height: 150px;
    height: var(--chart-container-height);
    max-height: var(--chart-container-height);
  }
}
</style>
