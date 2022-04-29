<template>
  <section id="history">
    <entity-history-details
      :history-log="selectedLog"
      :show.sync="showDetails"
    />
    <v-container fluid class="pa-0">
      <data-viewer :loading="loading" :error="error">
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
                  :position="i"
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
      </data-viewer>
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
import { useBus } from "@/composables/bus";
import { useApi } from "@/composables/api";

export default {
  name: "EntityHistory",
  mixins: [InfiniteScroll],
  components: {
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
  setup() {
    const { request, error, loading } = useRequest();
    const { getEntityApiById, getCollectionNameById } = useApi();
    const { on } = useBus();
    return {
      error,
      loading,
      on,
      getEntityApiById,
      getCollectionNameById,
      request,
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
        observerState.loading = true;
        this.loadPage()
          .then(({ collection, cursor }) => {
            this.history.push(...collection);
            this.cursor = cursor;
          })
          .catch((e) => {
            observerState.error = true;
            throw e;
          })
          .finally(() => (observerState.loading = false));
      }
    },
    loadFirstPage() {
      return this.request(
        this.loadPage(null).then(({ collection, cursor }) => {
          this.history = collection;
          this.cursor = cursor;
        })
      );
    },
    loadPage(cursor = this.cursor) {
      return this.$api.history
        .getHistories({
          pageSize: 50,
          attributedTo: this.id,
          humanReadable: true,
          ...(cursor ? { cursor } : {}),
        })
        .then(async ({ data: { collection, cursor } }) => {
          const creatorsGroups = collection.reduce((group, entry) => {
            const { creatorId } = entry;
            const collectionName = this.getCollectionNameById(creatorId);
            group[collectionName] = group[collectionName] ?? [];
            group[collectionName].push(creatorId);
            return group;
          }, {});
          const creators = (
            await Promise.all(
              Object.entries(creatorsGroups).map(([collectionName, ids]) =>
                this.$api[collectionName].getManyById(ids)
              )
            )
          ).flat();
          console.log(creators);
          const historiesWithCreators = collection.map((entry) => ({
            ...entry,
            creator: creators.find(({ id }) => id === entry.creatorId) ?? {},
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
    this.loadFirstPage();
    this.on("reload", this.loadFirstPage);
  },
};
</script>
<style lang="scss" scoped></style>
