<template>
  <v-snackbar v-model="computedSnackbar" v-bind="$attrs">
    <div class="d-flex justify-space-between align-center">
      <b>
        {{ eventData.message }}
      </b>
      <slot>
        <v-btn
          v-if="showReloadButton"
          text
          small
          color="primary"
          @click="() => reload()"
          :loading="loading"
        >
          Load changes
        </v-btn>
      </slot>
    </div>
  </v-snackbar>
</template>

<script>
import { useUser } from "@/composables/user";
import { computed } from "@vue/composition-api";

export default {
  name: "EntityEventSnackbar",
  props: {
    snackbar: {
      type: Boolean,
      required: true,
    },
    eventData: {
      type: Object,
      required: true,
    },
    manualReload: {
      type: Boolean,
      default: true,
    },
    reloadMethod: {
      type: Function,
      default: () => () => {},
    },
  },
  setup(props) {
    const { user } = useUser();
    return {
      showReloadButton: computed(
        () => user.value.id === props.eventData.actorId || props.manualReload
      ),
    };
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    computedSnackbar: {
      get() {
        return this.snackbar;
      },
      set(val) {
        return this.$emit("update:snackbar", val);
      },
    },
  },
  methods: {
    reload() {
      this.loading = true;
      return this.reloadMethod().then(() => {
        this.loading = false;
        this.computedSnackbar = false;
      });
    },
  },
};
</script>

<style scoped></style>
