<template>
  <colored-card
    :padding="false"
    color="transparent"
    class="check-box-card fill-height"
    v-ripple="{ class: isChecked || disabled ? 'd-none' : '' }"
    :class="[
      { checked: isChecked },
      { disabled: disabled },
      `check-box-card-${cardColor}`,
    ]"
  >
    <span
      slot="header"
      class="check-box-card-title-container d-flex align-center"
      @click="toggleCheck"
    >
      <span class="check-box-card-indicator mr-1"></span>
      <span class="check-box-card-title">{{ title }}</span>
    </span>
    <div
      slot="body"
      class="check-box-card-body mt-3 ml-4 fill-height"
      @click="() => !checked && toggleCheck()"
    >
      <slot :checked="checked" :check="check" :uncheck="uncheck"></slot>
    </div>
  </colored-card>
</template>

<script>
import ColoredCard from "@/components/Base/ColoredCard";
export default {
  name: "CheckBoxCard",
  components: { ColoredCard },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    deselectable: {
      type: Boolean,
      default: true,
    },
    manually: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    primary: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    isLoading: false,
    checked: false,
  }),
  watch: {
    active() {
      this.checked = this.active;
      this.emitChange();
    },
  },
  computed: {
    isChecked() {
      return (this.active || this.checked) && !this.disabled;
    },
    cardColor() {
      return this.primary ? "primary" : "alternative";
    },
  },
  methods: {
    uncheck() {
      this.checked = false;
    },
    check() {
      this.checked = true;
    },
    toggleCheck() {
      if (!this.disabled) {
        this.emitClick();
      }
      if (this.deselectable && !this.manually) {
        this.checked = !this.checked;
        this.emitChange();
      }
    },
    emitChange() {
      this.$emit("change", this.checked);
    },
    emitClick() {
      this.$emit("clicked", this.checked);
    },
  },
  mounted() {
    this.checked = this.active;
  },
};
</script>

<style scoped lang="scss">
.check-box-card {
  transition: 0.3s;
  border: 2px solid $bg_primary;
  padding: 10px;
  width: 100%;
  ::v-deep .card-header {
    display: block;
  }
  &.disabled {
    .check-box-card-indicator {
      border: 1px solid gray;
    }
    .check-box-card-title {
      color: $font_secondary_color !important;
    }
  }
  &.checked {
    background-color: $bg_card_secondary;
    .check-box-card-indicator {
      background: $c_accent_primary;
    }
    &.check-box-card-primary {
      .check-box-card-indicator {
        background: $c_accent_primary; //$c_accent_secondary;
        border: 1px solid $c_accent_secondary;
      }
    }
  }
}
.check-box-card-ripple {
  position: absolute;
  top: -10px;
  left: -10px;
  height: 100%;
  width: 100%;
}
.check-box-card-content {
  position: relative;
  z-index: 10;
}
.check-box-card-indicator {
  transition: 0.3s;
  display: inline-block;
  border: 1px solid $c_accent_primary;
  padding: 5px;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: transparent;
}
.check-box-card-title-container {
  cursor: pointer;
  display: block;
  line-height: 0.7rem;
  font-size: 0.9rem;
}
.check-box-card-body {
  font-size: 0.95rem;
  color: $font_secondary_color;
  font-weight: bold;
}
</style>
