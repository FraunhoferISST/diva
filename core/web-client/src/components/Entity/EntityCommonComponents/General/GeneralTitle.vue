<template>
  <h1 class="general-title">
    <v-avatar slot="activator" size="40px" :tile="true">
      <identicon :hash="hash" />
    </v-avatar>
    {{ title }}
  </h1>
</template>

<script>
import Identicon from "@/components/Base/Identicon";

export default {
  name: "GeneralTitle",
  components: { Identicon },
  props: {
    title: String,
    hash: {
      type: String,
      required: false,
      default: "",
    },
  },
};
</script>

<style scoped lang="scss">
.general-title {
  transition: 0.3s;
  width: 100%;
  display: inline-block;
  cursor: pointer;
  position: relative;
  @include font-style(1.5rem, $font_body, bold, rgba($font_primary_color, 1));
}
</style>
