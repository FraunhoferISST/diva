<template>
  <div
    class="c-switch-container"
    :style="{ width: `${size * options.length}px` }"
    :class="{
      inverse: inverse,
      large: large,
      small: small,
      mini: mini,
      round: round,
    }"
  >
    <div class="c-switch">
      <span
        class="c-switch-indicator"
        :style="{
          backgroundColor: bg,
          width: `${indicatorWidth}%`,
          left: `${indicatorWidth * selectedIndex}%`,
        }"
      ></span>
      <label
        :style="{ color: color }"
        :class="{ active: option.label === selected }"
        v-for="option in options"
        :key="option.label"
      >
        <input type="radio" :value="option.label" v-model="computedSelected" />
        <v-icon
          :color="option.label === selected ? 'white' : ''"
          :small="small"
          :x-small="mini"
          v-if="option.icon"
          >{{ option.icon }}</v-icon
        >
        <span v-else>{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "SwitchSlider",
  props: {
    options: {
      type: Array,
      required: true,
    },
    selected: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    inverse: {
      type: Boolean,
      default: false,
    },
    mini: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    bg: {
      type: String,
      default: "#2d68fc",
    },
    color: {
      type: String,
      default: "",
    },
    round: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    computedSelected: {
      get() {
        return this.selected;
      },
      set(value) {
        this.$emit("update:selected", value);
      },
    },
    selectedIndex() {
      if (!this.selected) return 0;
      return this.options.findIndex(({ label }) => label === this.selected);
    },
    indicatorWidth() {
      return 100 / this.options.length;
    },
  },
};
</script>

<style scoped lang="scss">
.c-switch-container {
  @include border-radius-half();
  padding: 5px;
  background-color: $bg_primary;
  height: 40px;
  box-shadow: 0 0.07em 0.1em -0.1em rgba(#000, 0.2) inset,
    0 0.05em 0.08em -0.01em rgba(#fff, 0.5);
  &.round {
    border-radius: 30px;
    label,
    .c-switch-indicator {
      border-radius: 30px;
    }
  }
  &.inverse {
    background-color: white;
    box-shadow: 0 0 5px 2px rgba(#898989, 0.03);
  }
  &.mini {
    height: 20px;
    padding: 0;
    label {
      font-size: 0.7rem !important;
    }
  }
  &.small {
    height: 28px;
    padding: 0;
  }
  &.large {
    height: 54px;
  }
}
.c-switch {
  position: relative;
  display: flex;
  border-radius: 50px;
  height: 100%;
  .c-switch-indicator {
    @include border-radius-half();
    height: 100%;
    transition: 0.3s;
    display: block;
    flex: 1;
    left: 0;
    background-color: white;
    position: absolute;
    &.inverse {
      background-color: $bg_primary;
    }
  }
  input {
    position: absolute;
    height: 0;
    width: 0;
    opacity: 0;
  }
  label {
    transition: 0.3s;
    @include font-style(0.9rem, $font_body, bold, $font_primary_color);
    cursor: pointer;
    font-size: 0.9rem;
    position: relative;
    z-index: 1;
    flex: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    @include border-radius-half();
    &:hover {
      background-color: rgba(#2d68fc, 0.1);
    }
    &.active {
      color: white;
    }
  }
}
</style>
