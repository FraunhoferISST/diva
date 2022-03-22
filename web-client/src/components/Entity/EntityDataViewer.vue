<template>
  <div class="relative">
    <div v-if="isUpdating" class="data-viewer-updating">
      <span v-if="updating"> updating... </span>
      <v-icon v-else color="success" x-small>done</v-icon>
    </div>
    <fade-in-group>
      <v-progress-circular
        key="loading"
        class="data-viewer-loading"
        v-if="loading || !data"
        indeterminate
        color="primary"
        width="2"
      ></v-progress-circular>
      <v-alert
        key="alert"
        v-else-if="error"
        dense
        text
        color="error"
        class="text-center ma-0"
      >
        <p class="text-center ma-0">
          {{ errorMessage || "Some error occurred while loading data" }}
        </p>
      </v-alert>
      <div key="content" v-else>
        <div v-if="data">
          <slot :data="data"> </slot>
        </div>
      </div>
    </fade-in-group>
    <entity-event-snackbar
      :event-data="eventData || {}"
      :color="color"
      top
      absolut
      :snackbar.sync="snackbar"
      :reload-method="reload"
    />
  </div>
</template>
<script>
import FadeInGroup from "@/components/Transitions/FadeInGroup";
import { useSnackbar } from "@/composables/snackbar";
import { useEntity } from "@/composables/entity";
import EntityEventSnackbar from "@/components/Entity/EntityEventSnackbar";
export default {
  name: "EntityDataViewer",
  components: { EntityEventSnackbar, FadeInGroup },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { c: color, show: showSnackbar, message, snackbar } = useSnackbar();
    const onEvent = ({ message, action }) => {
      showSnackbar(message, {
        color: action === "updated" ? "success" : "error",
      });
    };
    const { load, loading, error, data, reload, updating, eventData } =
      useEntity(props.id, {
        reactive: true,
        onEvent,
      });
    load();
    return {
      load,
      reload,
      loading,
      updating,
      error,
      data,
      color,
      message,
      snackbar,
      eventData,
      showSnackbar,
    };
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
