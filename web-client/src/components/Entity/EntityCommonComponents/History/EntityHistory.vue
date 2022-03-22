<template>
  <section id="history">
    <entity-history-details
      :history-log="selectedLog"
      :show.sync="showDetails"
    />
    <v-container fluid class="pa-0">
      <reactive-data-viewer :load-method="fetchInitialHistory" :id="id">
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
      </reactive-data-viewer>
      <observer @intersect="loadNextPage" />
    </v-container>
  </section>
</template>

<script>
import HistoryCard from "@/components/Entity/EntityCommonComponents/History/HistoryCard";
import NoDataState from "@/components/Base/NoDataState";
import EntityHistoryDetails from "@/components/Entity/EntityCommonComponents/History/EntityHistoryDetails";
import InfiniteScroll from "@/components/Mixins/infiniteScroll";
import Observer from "@/components/Base/Observer";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useRequest } from "@/composables/request";
import { useEvents } from "@/composables/events";
import { useUser } from "@/composables/user";
import ReactiveDataViewer from "@/components/DataFetchers/ReactiveDataViewer";

export default {
  name: "EntityHistory",
  mixins: [InfiniteScroll],
  components: {
    ReactiveDataViewer,
    DataViewer,
    Observer,
    EntityHistoryDetails,
    NoDataState,
    HistoryCard,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { user } = useUser();
    const onEvent = (eventData) => {
      console.log(eventData);
    };
    useEvents(props.id, user.id, onEvent);
    const { request, error, loading } = useRequest();
    return {
      request,
      error,
      loading,
    };
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
      return this.request(
        this.fetchHistory().then(({ collection, cursor }) => {
          this.history = collection;
          this.cursor = cursor;
        })
      );
    },
    fetchHistory() {
      return this.$api.history
        .getHistories({
          pageSize: 50,
          attributedTo: this.id,
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
    selectHistoryLog(log) {
      this.selectedLog = log;
      this.showDetails = true;
    },
  },
  mounted() {
    this.fetchInitialHistory();
  },
};
</script>
<style lang="scss" scoped></style>
