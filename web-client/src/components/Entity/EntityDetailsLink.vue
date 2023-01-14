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
    postfix: {
      type: String,
      default: "",
    },
  },
  computed: {
    route() {
      switch (true) {
        case this.id.startsWith("asset"):
          return `/assets/${this.id}${this.postfix}`;
        case this.id.startsWith("resource"):
          return `/resources/${this.id}${this.postfix}`;
        case this.id.startsWith("user"):
          return `/users/${this.id}${this.postfix}`;
        case this.id.startsWith("destroyclaim"):
          return `/destroyclaims/${this.id}${this.postfix}`;
        default:
          return `/entities/${this.id}${this.postfix}`;
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
