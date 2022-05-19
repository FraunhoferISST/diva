<template>
  <div class="relative">
    <data-viewer :loading="loading" :error="error">
      <slot :toggleLike="toggleLike">
        <v-btn
          color="red"
          icon
          :loading="toggleLoading"
          @click.stop.prevent="toggleLike"
          v-bind="$attrs"
        >
          <v-icon color="red" v-bind="$attrs">
            {{ isLikedByUser ? "favorite" : "favorite_border" }}
          </v-icon>
        </v-btn>
      </slot>
    </data-viewer>
    <v-snackbar
      min-width="100px"
      width="280px"
      absolute
      round
      :timeout="10000"
      bottom
      text
      v-model="snackbar"
      :color="color"
      style="font-weight: bold"
    >
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script>
import { useUser } from "@/composables/user";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";
import { ref } from "@vue/composition-api";
import { useApi } from "@/composables/api";
import { onMounted } from "@vue/composition-api/dist/vue-composition-api";
import { useBus } from "@/composables/bus";

export default {
  name: "EntityLikeButton",
  components: { DataViewer },
  props: {
    id: {
      type: String,
      required: true,
    },
    ignoreErrors: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isLikedByUser = ref(false);
    const likeEdge = ref(null);
    const { on } = useBus();
    const { request, loading, error } = useRequest();
    const { datanetwork } = useApi();
    const {
      request: toggleReq,
      loading: toggleLoading,
      error: toggleError,
    } = useRequest();
    const { snackbar, show, color, message } = useSnackbar();
    const { user } = useUser();

    const likeEntity = () =>
      datanetwork
        .createEdge({
          from: user.value.id,
          edgeType: "likes",
          to: props.id,
        })
        .then(({ data: newEdgeId }) => {
          isLikedByUser.value = true;
          likeEdge.value = {
            id: newEdgeId,
          };
        });

    const dislikeEntity = () =>
      datanetwork
        .deleteEdgeById(likeEdge.value.id)
        .then(() => (isLikedByUser.value = false))
        .then(() => (likeEdge.value = null));

    const checkIfIsLikedByUser = () =>
      request(
        datanetwork
          .getEdges({
            from: user.value.id,
            edgeTypes: "likes",
            to: props.id,
          })
          .then(({ data }) => {
            isLikedByUser.value = data.collection.length > 0;
            if (data.collection.length > 0) {
              likeEdge.value = {
                ...data.collection[0],
                id: data.collection[0]?.properties?.id,
              };
            } else {
              likeEdge.value = null;
            }
          })
      );

    checkIfIsLikedByUser();

    onMounted(() => {
      on("reload", checkIfIsLikedByUser);
    });

    return {
      loading,
      error,
      snackbar,
      color,
      message,
      toggleError,
      toggleLoading,
      isLikedByUser,
      show,
      toggleLike: () => {
        let promise = null;
        if (isLikedByUser.value) {
          promise = dislikeEntity();
        } else {
          promise = likeEntity();
        }
        return toggleReq(promise).then(() => {
          if (toggleError.value) {
            show(
              `${
                toggleError.value?.response?.data?.message ?? toggleError.value
              }. Please try again later`,
              { color: "error" }
            );
          }
        });
      },
    };
  },
};
</script>

<style scoped></style>
