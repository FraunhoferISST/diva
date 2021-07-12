<template>
  <div class="create-form-action-card">
    <colored-card :color="color">
      <div
        slot="body"
        class="d-flex justify-center align-center create-form-action-card-content"
      >
        <div class="text-center">
          <h1 v-if="title" class="create-form-action-card-title pb-3">
            {{ title }}
          </h1>
          <div v-if="image" class="text-center mb-4">
            <img
              width="150px"
              height="150px"
              :src="require('@/assets/' + image)"
            />
          </div>
          <p class="create-form-action-card-hint" v-if="hint">
            {{ hint }}
          </p>
        </div>
      </div>

      <!-- Action Button-->
      <slot> </slot>
    </colored-card>
  </div>
</template>

<script>
import ColoredCard from "../Base/ColoredCard";
export default {
  name: "CreateFormActionCard",
  components: { ColoredCard },
  props: {
    title: {
      type: String,
      required: false,
    },
    hint: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: "primary",
    },
    image: {
      type: String,
      required: false,
    },
  },
};
</script>

<style scoped lang="scss">
.create-form-action-card {
}
.create-form-action-card-content {
  min-height: 400px;
}
.create-form-action-card-title {
  @include font-style(2.2rem, $font_body, bold, $font_primary_color_inverse);
}

.create-form-action-card-hint {
  @include font-style(1.5rem, $font_body, normal, $font_primary_color_inverse);
}
</style>
