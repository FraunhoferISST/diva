<template>
  <div class="relative">
    <data-viewer :loading="loading" :error="error">
      <slot
        :toggleLike="toggleLike"
        :like="likeEntity"
        :dislike="dislikeEntity"
      >
        <v-btn color="red" icon :loading="toggleLoading" @click="toggleLike">
          <v-icon color="red">
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

export default {
  name: "EntityLikeButton",
  components: { DataViewer },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { request, loading, error } = useRequest();
    const {
      request: toggleReq,
      loading: toggleLoading,
      error: toggleError,
    } = useRequest();
    const { snackbar, show, color, message } = useSnackbar();
    const { user } = useUser();
    return {
      request,
      loading,
      error,
      user,
      snackbar,
      show,
      color,
      message,
      toggleError,
      toggleLoading,
      toggleReq,
    };
  },
  data: () => ({
    isLikedByUser: false,
    likeEdge: null,
  }),
  methods: {
    toggleLike() {
      let promise = null;
      if (this.isLikedByUser) {
        promise = this.dislikeEntity();
      } else {
        promise = this.likeEntity();
      }
      return this.toggleReq(promise).then(() => {
        if (this.toggleError) {
          this.show(
            `${
              this.toggleError?.response?.data?.message ??
              this.toggleError.toString()
            }. Please try again later`,
            { color: "error" }
          );
        }
      });
    },
    likeEntity() {
      return this.$api.datanetwork
        .postEdge({
          from: this.user.id,
          edgeType: "likes",
          to: this.id,
        })
        .then(({ data: newEdgeId }) => {
          this.isLikedByUser = true;
          this.likeEdge = {
            id: newEdgeId,
          };
        });
    },
    dislikeEntity() {
      return this.$api.datanetwork
        .deleteEdgeById(this.likeEdge.id)
        .then(() => (this.isLikedByUser = false));
    },
    checkIfIsLikedByUser() {
      return this.request(
        this.$api.datanetwork
          .getEdges({
            from: this.user.id,
            edgeTypes: "likes",
            to: this.id,
          })
          .then(({ data }) => {
            this.isLikedByUser = data.collection.length > 0;
            this.likeEdge = data.collection[0];
          })
      );
    },
  },
  mounted() {
    this.checkIfIsLikedByUser();
  },
};
</script>

<style scoped></style>
