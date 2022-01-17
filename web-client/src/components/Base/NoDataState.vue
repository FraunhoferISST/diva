<template>
  <div class="no-data-container text-center pa-2">
    <div class="fill-height d-flex flex-column align-center justify-center">
      <slot>
        <p class="ma-0">{{ text || "No Data Available" }}</p>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoDataState",
  props: ["text"],
};
</script>

<style scoped lang="scss">
.no-data-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: rgba($bg_primary, 1); //#f6f6f6;
  text-align: center;
  //border: 1px #ebebeb solid;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.05);
  @include font-style(
    0.9rem,
    $font_body,
    bold,
    rgba($font_secondary_color, 0.7)
  );
}
</style>
