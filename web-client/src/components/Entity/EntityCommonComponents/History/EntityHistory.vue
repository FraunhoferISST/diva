<template>
  <section id="history" class="pb-12">
    <entity-history-details
      :history-log="selectedLog"
      :show.sync="showDetails"
    />
    <v-container fluid>
      <reactive-data-fetcher :fetch-method="fetchInitialHistory" :id="id">
        <template>
          <v-container fluid class="pa-0">
            <v-row v-if="history.length > 0">
              <v-col
                cols="12"
                v-for="(historyLog, i) in history"
                :key="historyLog.id"
              >
                <history-card
                  :data="historyLog"
                  :last="i === history.length - 1"
                  :first="i === 0"
                  :count="history.length"
                  @selected="selectHistoryLog(historyLog)"
                />
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12"> <no-data-state /></v-col>
            </v-row>
          </v-container>
        </template>
      </reactive-data-fetcher>
      <observer @intersect="loadNextPage" />
    </v-container>
  </section>
</template>

<script>
import ReactiveDataFetcher from "@/components/DataFetchers/ReactiveDataFetcher";
import HistoryCard from "@/components/Entity/EntityCommonComponents/History/HistoryCard";
import NoDataState from "@/components/Base/NoDataState";
import EntityHistoryDetails from "@/components/Entity/EntityCommonComponents/History/EntityHistoryDetails";
import InfiniteScroll from "@/components/Mixins/infiniteScroll";
import Observer from "@/components/Base/Observer";

export default {
  name: "EntityHistory",
  mixins: [InfiniteScroll],
  components: {
    Observer,
    EntityHistoryDetails,
    NoDataState,
    HistoryCard,
    ReactiveDataFetcher,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selectedLog: {},
    showDetails: false,
    history: [],
    cursor: "",
  }),
  methods: {
    loadNextPage(observerState) {
      if (this.cursor) {
        this.loadPage(observerState, this.fetchHistory()).then(
          ({ collection, cursor }) => {
            this.history.push(...collection);
            this.cursor = cursor;
          }
        );
      }
    },
    fetchInitialHistory() {
      return this.fetchHistory().then(({ collection, cursor }) => {
        this.history = collection;
        this.cursor = cursor;
      });
    },
    fetchHistory() {
      return this.$api.history
        .getHistories({
          pageSize: 50,
          belongsTo: this.id,
          humanReadable: true,
          ...(this.cursor ? { cursor: this.cursor } : {}),
        })
        .then(async ({ data: { collection, cursor } }) => {
          const creators = await this.$api.users.getManyById(
            collection.map(({ creatorId }) => creatorId)
          );
          const historiesWithCreators = collection.map((entry) => ({
            ...entry,
            creator: creators.find(({ id }) => id === entry.creatorId),
          }));
          return {
            collection: historiesWithCreators,
            cursor,
          };
        });
    },
    async getCreator(historyLog) {
      // TODO: is this case still possible?
      if (historyLog.creatorId.startsWith("service:")) {
        return { username: "Internal service" };
      }
      return (
        await this.$api.users
          .getByIdIfExists(historyLog.creatorId)
          .catch(() => null)
      )?.data;
    },
    selectHistoryLog(log) {
      this.selectedLog = log;
      this.showDetails = true;
    },
  },
};
</script>
<style lang="scss" scoped></style>
