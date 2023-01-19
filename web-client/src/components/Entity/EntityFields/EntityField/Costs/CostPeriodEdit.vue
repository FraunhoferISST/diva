<template>
  <v-select
    color="info"
    clearable
    hide-details
    outlined
    :items="periods"
    v-model="computedPeriod"
    label="Period"
    dense
  ></v-select>
</template>

<script>
export default {
  name: "CostPeriodEdit",
  props: {
    period: {
      required: true,
    },
  },
  data: () => ({
    periods: ["unlimited", "monthly", "quarterly", "half-yearly", "yearly", ""],
  }),
  computed: {
    computedPeriod: {
      get() {
        return this.period;
      },
      set(value) {
        this.$emit("update:period", value);
      },
    },
  },
};
</script>

<style scoped lang="scss">
.period-group {
  border-radius: 4px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.period-input {
  display: none;

  & + label.period-label {
    cursor: pointer;
    transition: 0.3s;
    text-align: center;
    display: block;
    width: 100%;
    //margin: 0 5px 5px 0;
    padding: 2px 10px;
    border-radius: 0px;
    letter-spacing: 0.05rem;
    border: 0px solid rgba($c_accent_primary, 0.3) !important;
    overflow: hidden;
    @include font-style(
      $size: 0.7rem,
      $family: $font_body,
      $weight: bolder,
      $color: rgba($font_secondary_color, 1)
    );
    position: relative;
    background: rgba($c_accent_primary, 0.1) !important;
    &:hover {
      background: rgba($c_accent_primary, 0.3) !important;
      color: rgba($font_primary_color, 1);
    }
    span {
      position: relative;
      z-index: 1;
      border-radius: 2px;
    }
    &:before {
      transition: 0.3s;
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: $c_accent_primary;
      opacity: 0;
      z-index: 0;
    }
  }
  &:checked {
    & + label.period-label {
      // border: 2px solid rgba($c_accent_primary, 0) !important;
      color: white;
      &:before {
        opacity: 1;
      }
    }
  }
}
</style>
