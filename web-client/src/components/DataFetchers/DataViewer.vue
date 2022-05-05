<template>
  <div class="relative">
    <div v-if="isUpdating" class="data-viewer-updating">
      <span v-if="updating"> updating... </span>
      <span v-else>
        updated
        <v-icon color="success" x-small>done</v-icon>
      </span>
    </div>
    <v-fade-transition group>
      <v-progress-circular
        key="loading"
        class="data-viewer-loading"
        v-if="loading"
        indeterminate
        color="primary"
        width="2"
      ></v-progress-circular>
      <div key="alert" v-else-if="error">
        <slot>
          <v-alert dense text color="error" class="text-center ma-0">
            <p class="text-center ma-0">
              {{ errorMessage || "Some error occurred while loading data" }}
            </p>
          </v-alert>
        </slot>
      </div>
      <div key="content" v-else>
        <slot> </slot>
      </div>
    </v-fade-transition>
  </div>
</template>
<script>
import FadeInGroup from "@/components/Transitions/FadeInGroup";
export default {
  name: "DataViewer",
  components: { FadeInGroup },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    updating: {
      type: Boolean,
      default: false,
    },
    error: {
      default: null,
    },
  },
  data: () => ({
    isUpdating: false,
  }),
  watch: {
    updating() {
      if (this.updating) {
        this.isUpdating = true;
      } else {
        setTimeout(() => (this.isUpdating = false), 5000);
      }
    },
  },
  computed: {
    errorMessage() {
      if (this.error) {
        return (
          this.error?.response?.data?.message ??
          this.error?.message ??
          this.error.toString() ??
          "Somme error occurred"
        );
      }
      return "";
    },
  },
};
</script>

<style scoped lang="scss">
.data-viewer-updating {
  position: absolute;
  right: 10px;
  top: 10px;
  padding: 2px 4px;
  font-size: 0.7rem;
  @include border-radius-half;
  background-color: rgba(0, 0, 0, 0.05);
  z-index: 1;
}
.data-viewer-loading {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>
