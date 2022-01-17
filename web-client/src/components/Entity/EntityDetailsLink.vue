<template>
  <router-link :to="route" class="entity-details-link">
    <slot></slot>
  </router-link>
</template>
<script>
export default {
  name: "EntityDetailsLink",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    route() {
      switch (true) {
        case this.id.startsWith("asset"):
          return `/assets/${this.id}`;
        case this.id.startsWith("resource"):
          return `/resources/${this.id}`;
        case this.id.startsWith("user"):
          return `/users/${this.id}`;
        default:
          return `/resources/${this.id}`;
      }
    },
  },
};
</script>

<style lang="scss">
.entity-details-link {
  transition: 0.3s;
  color: $btn_flat_text;
  &:hover {
    color: $font_link_color_hover;
  }
}
</style>
