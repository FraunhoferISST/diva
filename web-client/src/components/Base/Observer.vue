<template>
  <div class="observer">
    <!--    <div
      style="position: fixed; top: 100px; padding: 20px; background-color: snow"
    >
      {{ state }}
      {{ _uid }}/
      {{ interval }}
    </div>-->
    <div v-if="state.loading" class="d-flex justify-center">
      <slot :changeState="changeState">
        <vue-ellipse-progress
          :progress="0"
          loading
          :size="30"
          :empty-thickness="0"
        />
      </slot>
    </div>
    <div v-if="state.error" class="d-flex justify-center">
      <slot name="error" :changeState="changeState">
        <v-alert dense text color="error">
          Some error occurred while loading data
        </v-alert>
      </slot>
    </div>
    <div v-if="state.completed && !state.error">
      <slot name="completed" :changeState="changeState"> </slot>
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
    interval: null,
    state: {
      loading: false,
      completed: false,
      error: false,
    },
  }),
  watch: {
    id() {
      this.state = { loading: false, completed: false, error: false };
      this.destroyObserver();
      this.createObserver();
    },
  },

  methods: {
    createObserver() {
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry) {
          if (entry.isIntersecting) {
            this.handleVisibility();
          } else {
            this.clearIntervalHolder();
          }
        }
      });
      this.observer.observe(this.$el);
    },
    handleVisibility() {
      if (!this.state.completed) {
        this.$emit("intersect", this.changeState);
        /*
         * In the case that on some screens tha page size is too small and after first page loading the observer remains visible on the page,
         * the intersection event will not fire again and the next page couldn't be loaded. To fix this, while visible the observer fires intersection events
         * in interval until it's hidden again or completed
         * */
        if (!this.interval) {
          this.interval = setInterval(() => {
            if (!this.state.loading && !this.state.completed && this.interval) {
              return this.$emit("intersect", this.changeState);
            }
            if (this.state.completed) {
              this.clearIntervalHolder();
            }
          }, 300);
        }
      } else {
        clearInterval(this.interval);
      }
    },
    clearIntervalHolder() {
      clearInterval(this.interval);
      this.interval = null;
    },
    destroyObserver() {
      this.observer.disconnect();
    },
    changeState({ loading, error, completed } = this.state) {
      this.state = { loading, error, completed };
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
