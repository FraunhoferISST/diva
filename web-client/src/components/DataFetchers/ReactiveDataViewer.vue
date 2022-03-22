<template>
  <div class="relative">
    <div v-if="isUpdating" class="data-viewer-updating">
      <span v-if="reloadLoading"> updating... </span>
      <v-icon v-else color="success" x-small>done</v-icon>
    </div>
    <fade-in-group>
      <v-progress-circular
        key="loading"
        class="data-viewer-loading"
        v-if="loading"
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
        <slot :updating="reloadLoading"> </slot>
      </div>
    </fade-in-group>
    <entity-event-snackbar
      :event-data="eventData || {}"
      :color="color"
      bottom
      absolut
      :snackbar.sync="snackbar"
      :reload-method="reload"
    />
  </div>
</template>
<script>
import FadeInGroup from "@/components/Transitions/FadeInGroup";
import { useSnackbar } from "@/composables/snackbar";
import { useEvents } from "@/composables/events";
import { useUser } from "@/composables/user";
import EntityEventSnackbar from "@/components/Entity/EntityEventSnackbar";
import { useRequest } from "@/composables/request";
import { onMounted } from "@vue/composition-api";
export default {
  name: "ReactiveDataViewer",
  components: { EntityEventSnackbar, FadeInGroup },
  props: {
    id: {
      type: String,
      required: true,
    },
    loadMethod: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const { c: color, show: showSnackbar, message, snackbar } = useSnackbar();
    const { request, loading, error } = useRequest();
    const {
      request: reloadRequest,
      loading: reloadLoading,
      error: reloadError,
    } = useRequest();

    const reload = () => reloadRequest(props.loadMethod());

    const onEvent = ({ message, action }) => {
      reload();
      showSnackbar(message, {
        color: action === "updated" ? "success" : "error",
      });
    };
    const { user } = useUser();
    const { data: eventData } = useEvents(props.id, user.id, onEvent);

    onMounted(() => request(props.loadMethod()));

    return {
      color,
      message,
      snackbar,
      showSnackbar,
      eventData,
      loading,
      error,
      reload,
      reloadLoading,
      reloadError,
    };
  },
  data: () => ({
    isUpdating: false,
  }),
  watch: {
    reloadLoading() {
      if (this.reloadLoading) {
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
