<template>
  <div class="colored-card" :class="['bg-' + color, roundedClass]">
    <div class="colored-card-background"></div>
    <card
      :padding="padding"
      :header="header"
      rounded="rounded"
      style="background-color: transparent"
    >
      <template slot="header">
        <slot name="header"></slot>
      </template>
      <template #body>
        <slot name="body"></slot>
        <slot></slot>
      </template>
      <template slot="footer">
        <slot name="footer"></slot>
      </template>
    </card>
  </div>
</template>

<script>
import Card from "@/components/Base/Card";
const alowedColors = [
  "primary",
  "secondary",
  "blue",
  "green",
  "red",
  "error",
  "success",
  "alternative",
  "transparent",
];
export default {
  name: "ColoredCard",
  components: { Card },
  props: {
    ...Card.props,
    color: {
      type: String,
      required: false,
      default: "primary",
      validator: (val) => {
        if (!alowedColors.includes(val)) {
          return false;
        }
        return true;
      },
    },
  },
  computed: {
    roundedClass() {
      return this.rounded ? "card-rounded" : "";
    },
  },
};
</script>

<style scoped lang="scss">
.colored-card {
  transition: 0.3s;
  position: relative;
  &.card-rounded {
    @include border-radius;
  }
}
.colored-card-background {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url("../../assets/card_back.svg");
  background-size: cover;
  background-position: 0;
  background-repeat: no-repeat;
  opacity: 0.5;
}

.bg-primary {
  background-color: rgba(54, 89, 255, 0.83);
}

.bg-transparent {
  background-color: transparent;
}

.bg-blue {
  background-color: rgba(#96c7f6, 1);
}

.bg-success {
  @include gradient-success();
}

.bg-green {
  background-color: #74d39f;
}

.bg-error {
  @include gradient-error();
}

.bg-red {
  @include gradient-red();
}

.bg-alternative {
  @include gradient-alternative();
}
</style>
