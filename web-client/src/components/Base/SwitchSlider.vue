<template>
  <div
    class="switch-container"
    :style="{ width: `${size * options.length}px` }"
    :class="{
      inverse,
      large,
      small,
      mini,
      round,
    }"
  >
    <div class="switch">
      <span
        class="switch-indicator shadow-sm"
        :style="{
          backgroundColor: bg,
          width: `${indicatorWidth}%`,
          left: `${indicatorWidth * selectedIndex}%`,
        }"
      ></span>
      <label
        :style="{ color: color }"
        :class="{ active: (option.title || option) === computedSelected }"
        v-for="option in options"
        :key="option.title || option"
      >
        <input
          type="radio"
          :checked="(option.title || option) === computedSelected"
          :value="option.title || option"
          v-model="computedSelected"
          @change="emitClick"
        />
        <v-icon
          small
          v-if="option.icon"
          :color="
            (option.title || option) === computedSelected ? 'white' : 'primary'
          "
        >
          {{ option.icon }}
        </v-icon>
        <span class="d-inline ml-1" v-if="!hideTitle">{{ option.title }}</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "SwitchSlider",
  emits: ["update:selected"],
  props: {
    selected: String,
    options: {
      type: Array,
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
      default: "#4d7bff",
    },
    color: {
      type: String,
      default: "",
    },
    round: {
      type: Boolean,
      default: true,
    },
    hideTitle: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedSelected: {
      get() {
        return this.selected;
      },
      set(val) {
        this.$emit("update:selected", val);
      },
    },
    selectedIndex() {
      return this.options.findIndex(
        (option) => (option.title || option) === this.selected
      );
    },
    indicatorWidth() {
      return 100 / this.options.length;
    },
  },
  methods: {
    emitClick() {
      this.$nextTick(() => this.$emit("select", this.selectedIndex));
    },
  },
};
</script>

<style scoped lang="scss">
.switch-container {
  padding: 4px;
  background-color: white;
  height: 32px;
  box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 0.1);
  &.round {
    border-radius: 30px;
    label,
    .switch-indicator {
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
.switch {
  position: relative;
  display: flex;
  border-radius: 50px;
  height: 100%;
  .switch-indicator {
    height: 100%;
    transition: 0.3s;
    display: block;
    flex: 1;
    left: 0;
    background-color: #265cff;
    position: absolute;
    &.inverse {
      background-color: white;
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
    &:hover {
      background-color: rgba(#2d68fc, 0.1);
    }
    &.active {
      color: white;
    }
  }
}
.dark {
  .switch-container {
    background-color: #22272e;
  }
}
</style>
