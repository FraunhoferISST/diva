<template>
  <div class="entity-based-data-fetcher-container full-width">
    <data-fetcher ref="dataFetcher" :fetch-method="fetchBaseData">
      <slot :data="data" :api="apiByEntityType" />
    </data-fetcher>
    <v-snackbar v-model="snackbar" color="#009374" top>
      <b>
        {{ snackbarMessage }}
      </b>
    </v-snackbar>
  </div>
</template>

<script>
import EntityUpdateEvents from "@/components/Mixins/EntityUpdateEvents";
import DataFetcher from "@/components/DataFetchers/DataFetcher";

export default {
  name: "EntityBaseDataFetcher",
  components: { DataFetcher },
  mixins: [EntityUpdateEvents],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    data: {},
    snackbar: false,
    snackbarMessage: "",
  }),
  computed: {
    apiByEntityType() {
      const entityType = this.id.slice(0, this.id.indexOf(":"));
      return this.$api[`${entityType}s`];
    },
    currentUser() {
      return this.$store.state.user;
    },
    baseDataFetcher() {
      return this.$refs.dataFetcher.baseDataFetcher;
    },
  },
  methods: {
    onUpdateEvent(data) {
      this.handleEvent(data);
    },
    onDeleteEvent(data) {
      this.handleEvent(data);
    },
    handleEvent(data) {
      this.baseDataFetcher.runFetchMethod();
      const actorId = data?.actor.id;
      const entityType = this.getEntityTypeById(data?.object?.id) ?? "entity";
      const action = `${data.type ?? "update"}d`;
      if (actorId.startsWith("service:")) {
        return this.showSnackbar(
          `Internal service ${action} this ${entityType} just now`
        );
      }
      if (actorId === this.currentUser.id) {
        this.showSnackbar(`You ${action} this ${entityType}`);
      } else if (actorId) {
        this.fetchUser(actorId).then((user) => {
          this.showSnackbar(
            `${user?.username || "N/A"} ${action} this ${entityType} just now`
          );
        });
      } else {
        this.showSnackbar(`${entityType} ${action}`);
      }
    },
    showSnackbar(msg) {
      this.snackbar = true;
      this.snackbarMessage = msg;
    },
    fetchUser(id) {
      return this.$api.users
        .getByIdIfExists(id)
        .then((response) => response?.data);
    },
    fetchRating() {
      return this.$api.analytics
        .averageRating(this.id)
        .then((response) => response?.data)
        .catch(() => null);
    },
    async fetchBaseData() {
      const { data } = await this.apiByEntityType.getById(this.id);
      this.data = {
        ...data,
        creator: await this.fetchUser(data.creatorId),
        rating: await this.fetchRating(),
      };
    },
    getEntityTypeById(entityId) {
      return entityId.slice(0, entityId.indexOf(":"));
    },
  },
};
</script>
<style>
.entity-based-data-fetcher-container {
  min-height: 250px;
}
</style>
