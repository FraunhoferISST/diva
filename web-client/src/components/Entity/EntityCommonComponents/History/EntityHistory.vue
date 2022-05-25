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
            <v-row v-if="historyEntries.length > 0">
              <v-col
                cols="12"
                v-for="(historyLog, i) in historyEntries"
                :key="historyLog.id"
              >
                <history-card
                  :data="historyLog"
                  :last="i === historyEntries.length - 1"
                  :first="i === 0"
                  :position="i"
                  :count="historyEntries.length"
                  @selected="selectHistoryLog(historyLog)"
                />
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12"> <no-data-state /></v-col>
            </v-row>
          </v-container>
          <observer
            @intersect="loadNextPage"
            v-if="historyEntries.length > 0"
          />
        </template>
      </data-viewer>
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
import { onMounted, ref } from "@vue/composition-api";

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
  setup(props) {
    const cursor = ref(null);
    const historyEntries = ref([]);
    const selectedLog = ref({});
    const showDetails = ref(false);
    const { request, error, loading } = useRequest();
    const { history, getCollectionNameById, api } = useApi();
    const { on } = useBus();
    const loadPage = (_cursor = cursor.value) =>
      history
        .getHistories({
          pageSize: 50,
          attributedTo: props.id,
          humanReadable: true,
          ...(_cursor ? { cursor: _cursor } : {}),
        })
        .then(async ({ data: { collection, cursor: c } }) => {
          const creatorsGroups = collection.reduce((group, entry) => {
            const { creatorId } = entry;
            const collectionName = getCollectionNameById(creatorId);
            group[collectionName] = group[collectionName] ?? [];
            group[collectionName].push(creatorId);
            return group;
          }, {});
          const creators = (
            await Promise.all(
              Object.entries(creatorsGroups).map(([collectionName, ids]) =>
                api[collectionName].getManyById(
                  ids,
                  {
                    fields: "id,title,username,entityType,email,serviceType",
                  },
                  {
                    onIgnoredError: (e, id) => {
                      if (e?.response?.data?.code === 403) {
                        return {
                          id,
                          visible: false,
                        };
                      }
                    },
                  }
                )
              )
            )
          ).flat();
          const historiesWithCreators = collection.map((entry) => ({
            ...entry,
            creator: creators.find(({ id }) => id === entry.creatorId) ?? {},
          }));
          return {
            collection: historiesWithCreators,
            cursor: c,
          };
        });

    const loadFirstPage = () =>
      request(
        loadPage(null).then(({ collection, cursor: c }) => {
          historyEntries.value = collection;
          cursor.value = c;
        })
      );

    onMounted(() => {
      loadFirstPage();
      on("reload", loadFirstPage);
    });

    return {
      historyEntries,
      selectedLog,
      showDetails,
      error,
      loading,
      cursor,
      loadNextPage: (changeStateMethod) => {
        if (cursor.value) {
          changeStateMethod({ loading: true });
          loadPage()
            .then(({ collection, cursor: c }) => {
              changeStateMethod({ loading: false });
              historyEntries.value.push(...collection);
              cursor.value = c;
              if (!cursor.value) {
                changeStateMethod({ completed: true });
              }
            })
            .catch((e) => {
              changeStateMethod({ error: true, loading: false });
              throw e;
            });
        }
      },
      selectHistoryLog: (log) => {
        selectedLog.value = log;
        showDetails.value = true;
      },
    };
  },
};
</script>
<style lang="scss" scoped></style>
