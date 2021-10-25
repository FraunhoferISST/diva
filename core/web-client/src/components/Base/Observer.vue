<template>
  <div class="observer">
    <div v-if="state.loading" class="d-flex justify-center py-4">
      <slot>
        <vue-ellipse-progress
          :progress="0"
          loading
          :size="30"
          :empty-thickness="0"
        />
      </slot>
    </div>
    <div v-if="state.error" class="d-flex justify-center py-4">
      <slot name="error">
        <v-alert dense text color="error">
          Some error occurred while loading data
        </v-alert>
      </slot>
    </div>
    <div v-if="state.completed && !state.error">
      <slot name="completed"> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Observer",
  props: {
    id: {
      required: false,
    },
  },
  data: () => ({
    observer: null,
    state: {
      loading: false,
      completed: false,
      error: false,
    },
  }),
  watch: {
    id() {
      this.satate = { loading: false, completed: false, error: false };
      this.destroyObserver();
      this.createObserver();
    },
  },
  methods: {
    createObserver() {
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting) {
          if (!this.state.completed) {
            this.$emit("intersect", this.state);
          }
        }
      });
      this.observer.observe(this.$el);
    },
    destroyObserver() {
      this.observer.disconnect();
    },
  },
  mounted() {
    this.createObserver();
  },
  destroyed() {
    this.destroyObserver();
  },
};
</script>

<style scoped></style>
