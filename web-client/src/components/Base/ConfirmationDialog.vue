<template>
  <v-dialog v-model="computedShow" width="500">
    <card>
      <template #body>
        <div class="pa-4">
          <p class="ma-0">
            <slot>
              Are you sure you want to perform this action? The changes cannot
              be rolled back!
            </slot>
          </p>
          <div class="d-flex justify-end align-center mt-10">
            <slot name="cancel">
              <v-btn
                class="mr-2"
                rounded
                text
                color="primary"
                @click="onCancel"
              >
                Cancel
              </v-btn>
            </slot>
            <slot name="confirm" :confirm="onConfirm">
              <v-btn small rounded color="primary" @click="onConfirm">
                Proceed
              </v-btn>
            </slot>
          </div>
          <slot name="info"></slot>
        </div>
      </template>
    </card>
  </v-dialog>
</template>

<script>
import Card from "./Card";
export default {
  name: "ConfirmationDialog",
  components: { Card },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    computedShow: {
      get() {
        return this.show;
      },
      set(val) {
        return this.$emit("update:show", val);
      },
    },
  },
  methods: {
    closeDialog() {
      this.computedShow = false;
    },
    onCancel() {
      this.$emit("cancel");
      this.closeDialog();
    },
    onConfirm() {
      this.$emit("confirm");
      this.closeDialog();
    },
  },
};
</script>

<style scoped></style>
