<template>
  <div class="ids-policy-card-wrapper full-width">
    <div class="fill-height">
      <slot :notifySuccess="notifySuccess" :notifyError="notifyError"></slot>
    </div>
    <v-slide-y-transition>
      <div
        v-if="showControls"
        class="ids-policy-card-wrapper-actions-container d-flex justify-center"
      >
        <v-btn
          :loading="isLoading"
          x-small
          rounded
          color="#20a66f"
          @click="runSaveMethod"
          dark
          class="control ma-0"
        >
          Apply changes
        </v-btn>
      </div>
    </v-slide-y-transition>
    <v-snackbar
      elevation="10"
      transition="slide-y-transition"
      class="ids-policy-card-wrapper-snackbar"
      right
      :color="snackbarColor"
      absolute
      text
      top
      :timeout="3000"
      v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "IdsPolicyCardWrapper",
  components: {},
  props: {
    saveMethod: {
      type: Function,
    },
    showControls: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isLoading: false,
    snackbar: false,
    snackbarColor: "",
    snackbarText: "",
  }),
  methods: {
    emitSave() {
      this.$emit("save");
    },
    notifySuccess(msg = "Changes applied") {
      this.snackbar = true;
      this.snackbarText = msg;
      this.snackbarColor = "#009374";
    },
    notifyError(msg) {
      this.snackbar = true;
      this.snackbarText = msg;
      this.snackbarColor = "error";
    },
    runSaveMethod() {
      this.isLoading = true;
      this.saveMethod()
        .then(() => this.notifySuccess())
        .catch((e) => this.notifyError(e))
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style scoped lang="scss">
.ids-policy-card-wrapper {
  position: relative;
}
.ids-policy-card-wrapper-actions-container {
  position: absolute;
  bottom: -10px;
  width: 100%;
}
.ids-policy-card-wrapper-snackbar {
  ::v-deep {
    .v-snack__content {
      min-height: unset;
      border-radius: 20px;
      padding: 2px 20px;
      font-weight: bold;
    }
    .v-snack__wrapper {
      height: 25px;
      min-height: unset;
      border-radius: 20px;
      min-width: unset;
    }
  }
  &.v-snack--top {
    top: -20px;
    right: -20px;
  }
}
</style>
