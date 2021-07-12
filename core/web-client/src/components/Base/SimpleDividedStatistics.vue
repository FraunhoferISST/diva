<template>
  <div class="stat-container">
    <sub-header class="stat-icon-container">
      {{ title }}
    </sub-header>
    <div class="stat-value-container">
      <h3>
        {{ value || "N/A" }}
      </h3>
    </div>
  </div>
</template>

<script>
import SubHeader from "./SubHeader";
export default {
  name: "SimpleDividedStatistics",
  components: { SubHeader },
  props: ["title", "value"],
};
</script>

<style scoped lang="scss">
.stat-icon-container {
  position: relative;
  z-index: 2;
  padding: 10px 0;

  &:after {
    content: "";
    height: 2px;
    display: block;
    position: absolute;
    width: 10%;
    opacity: 0.5;
    //border-bottom: 2px solid $bg_hover;
    background-color: $progressbar;
    bottom: 0;
    left: 0;
    z-index: 0;
  }
}

.stat-value-container {
  h3 {
    padding: 10px 0;
    @include font-style(
      0.9rem,
      $font_header,
      bold,
      rgba($font_primary_color, 1)
    );
    letter-spacing: 0.2rem;
  }
}
</style>
