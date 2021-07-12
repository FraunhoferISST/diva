<template>
  <div class="general-url-container d-flex justify-space-between align-center">
    <div class="general-url-icon px-2">
      <v-icon color="info"> link </v-icon>
    </div>
    <div class="general-url py-1 px-3 text-truncate">
      {{ url }}
    </div>
    <div>
      <v-btn @click.stop="copyUrl" rounded depressed color="info"> copy </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "GeneralUrl",
  components: {},
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  methods: {
    copyUrl() {
      this.$clipboard(this.url);
    },
  },
};
</script>

<style scoped lang="scss">
.general-url-container {
  background-color: $bg_card_secondary;
  border-radius: 50px;
  //box-shadow: 0 0 20px 5px rgba(black, 0.05);
}
.general-url {
  transition: 0.3s;
  color: black;
  letter-spacing: 0;
  width: 100%;
  @include font-style(0.8rem, $font_body, bold, rgba($font_primary_color, 1));
}
</style>
