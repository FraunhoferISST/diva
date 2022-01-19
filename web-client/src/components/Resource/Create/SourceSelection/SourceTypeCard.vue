<template>
  <div class="source-type-card-container text-center pt-4" @click="emitSelect">
    <div class="mb-2 d-flex justify-center">
      <v-img
        height="40"
        contain
        width="150"
        :src="require(`@/assets/sourceTypeIcons/${source.icon}`)"
      />
    </div>
    <span class="source-type-card-title pa-2 d-block">
      {{ source.title }}
    </span>
  </div>
</template>
<script>
export default {
  name: "SourceTypeCard",
  components: {},
  props: {
    source: {
      type: Object,
      required: true,
    },
  },
  methods: {
    emitSelect() {
      this.$emit("selected", this.source);
    },
  },
};
</script>

<style scoped lang="scss">
.source-type-card-container {
  transition: 0.3s;
  cursor: pointer;
  @include border-radius;
  &:hover {
    background-color: $btn_flat;
  }
}
.source-type-card-title {
  font-size: 0.9rem;
  color: $font_secondary_color;
  font-weight: bold;
}
</style>
