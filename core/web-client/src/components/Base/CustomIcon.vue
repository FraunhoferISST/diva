<template>
  <v-icon
    :medium="medium"
    :small="small"
    :large="large"
    :x-large="'x-large'"
    :class="color"
    class="custom-icon"
    :color="customColor"
    :style="size ? { fontSize: size } : {}"
    >{{ resolvedIcon }}</v-icon
  >
</template>

<script>
export default {
  name: "CustomIcon",
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: "gprimary",
    },
    customColor: {
      type: String,
      required: false,
    },
    small: {
      type: Boolean,
      required: false,
      default: false,
    },
    medium: {
      type: Boolean,
      required: false,
      default: true,
    },
    large: {
      type: Boolean,
      required: false,
      default: false,
    },
    "x-large": {
      type: Boolean,
      required: false,
      default: false,
    },
    size: {
      type: String,
      required: false,
      default: "",
    },
  },
  computed: {
    resolvedIcon() {
      if (this.$vuetify.icons.values[this.icon]) {
        return `$vuetify.icons.values.${this.icon}`;
      }
      return this.icon;
    },
  },
};
</script>

<style scoped lang="scss">
@mixin gradi-color($from, $to) {
  background-image: linear-gradient(to top right, $from 20%, $to 80%);
}

i.v-icon.custom-icon {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &.gprimary {
    @include gradient-primary;
  }
  &.gsecondary {
    @include gradient-secondary;
  }
  &.gdefault {
    @include gradi-color(white, white);
  }
  &.gred {
    @include gradient-error;
  }
  &.gsuccess {
    @include gradient-success;
  }
}
</style>
