<template>
  <colored-card
    :padding="false"
    color="transparent"
    class="check-box-card fill-height"
    v-ripple="{ class: isChecked || disabled ? 'd-none' : '' }"
    :class="[{ checked: isChecked }, { disabled: disabled }]"
  >
    <span
      slot="header"
      class="check-box-card-title-container d-flex align-center"
      @click="emitClick"
    >
      <span class="check-box-card-indicator mr-1"></span>
      <span class="check-box-card-title">{{ title }}</span>
    </span>
    <div
      slot="body"
      class="check-box-card-body pt-3 pl-4 fill-height"
      @click="() => !active && emitClick()"
    >
      <slot :active="active"></slot>
    </div>
  </colored-card>
</template>

<script>
import ColoredCard from "@/components/Base/ColoredCard";
export default {
  name: "CheckBoxCardItem",
  components: { ColoredCard },
  props: {
    active: {
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
  },
  computed: {
    isChecked() {
      return this.active && !this.disabled;
    },
  },
  methods: {
    emitClick() {
      this.$emit("clicked");
    },
  },
};
</script>

<style scoped lang="scss">
.check-box-card {
  transition: 0.2s;
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
