<template>
  <div class="completeness-bar-container">
    <span>{{ value + "%" || "N/A" }}</span>
    <div class="completeness-bar"></div>
    <div class="completeness-bar-progress" :style="{ width: width }"></div>
  </div>
</template>

<script>
export default {
  name: "CompletenessBar",
  props: {
    percent: {
      type: Number,
      required: true,
    },
  },
  computed: {
    value() {
      if (!this.percent) {
        return 0;
      }
      if (this.isInt()) {
        return this.percent;
      }
      return parseFloat(this.percent).toFixed(2);
    },
    width() {
      return `${this.percent}%`;
    },
  },
  methods: {
    isInt() {
      return Number(this.percent) === this.percent && this.percent % 1 === 0;
    },
  },
};
</script>

<style scoped lang="scss">
.completeness-bar-container {
  width: 100%;
  text-align: center;
  position: relative;
  height: 42px;
  span {
    z-index: 2;
    @include font-style(
      0.8rem,
      $font_header,
      bold,
      rgba($font_primary_color, 1)
    );
  }
}
.completeness-bar {
  display: block;
  position: absolute;
  width: inherit;
  max-height: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: $progressbar;
  text-align: center;
  //overflow: hidden;
  opacity: 0.3;
}
.completeness-bar-progress {
  position: absolute;
  left: 0;
  display: block;
  width: 100%;
  height: 4px;
  max-height: 4px;
  border-radius: 4px;
  background-color: $progressbar;
}
</style>
