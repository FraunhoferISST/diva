<template>
  <div class="relative">
    <data-fetcher :fetch-method="checkIfIsLikedByUser">
      <slot
        :toggleLike="toggleLike"
        :like="likeEntity"
        :dislike="dislikeEntity"
      >
        <v-btn color="red" icon :loading="loading" @click="toggleLike">
          <v-icon color="red">
            {{ isLikedByUser ? "favorite" : "favorite_border" }}
          </v-icon>
        </v-btn>
      </slot>
    </data-fetcher>
    <v-snackbar
      min-width="100px"
      width="280px"
      absolute
      round
      :timeout="10000"
      bottom
      text
      v-model="snackbar"
      :color="snackbarColor"
      style="font-weight: bold"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import DataFetcher from "@/components/DataFetchers/DataFetcher";
export default {
  name: "EntityLikeButton",
  components: { DataFetcher },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    snackbar: false,
    snackbarText: "",
    snackbarColor: "success",
    profilingInitiated: false,
    profilingExists: false,
    isLikedByUser: false,
    likeEdge: null,
  }),
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    toggleLike() {
      if (this.isLikedByUser) {
        return this.dislikeEntity();
      }
      return this.likeEntity();
    },
    likeEntity() {
      this.loading = true;
      this.$api.datanetwork
        .putEdge({
          from: this.user.id,
          edgeType: "likes",
          to: this.id,
        })
        .then(({ data: newEdgeId }) => {
          this.isLikedByUser = true;
          this.likeEdge = {
            id: newEdgeId,
          };
        })
        .catch((e) =>
          this.showSnackbar(
            `${
              e?.response?.data?.message ?? e.toString()
            }. Please try again later`,
            "error"
          )
        )
        .finally(() => (this.loading = false));
    },
    dislikeEntity() {
      this.loading = true;
      this.$api.datanetwork
        .deleteEdgeById(this.likeEdge.id)
        .then(() => (this.isLikedByUser = false))
        .catch((e) =>
          this.showSnackbar(
            `${
              e?.response?.data?.message ?? e.toString()
            }. Please try again later`,
            "error"
          )
        )
        .finally(() => (this.loading = false));
    },
    showSnackbar(msg = "Profiling successfully initiated", color = "success") {
      this.snackbarText = msg;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    checkIfIsLikedByUser() {
      this.loading = true;
      return this.$api.datanetwork
        .getEdges({
          from: this.user.id,
          edgeTypes: "likes",
          to: this.id,
        })
        .then(({ data }) => {
          this.isLikedByUser = data.collection.length > 0;
          this.likeEdge = data.collection[0];
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped></style>
