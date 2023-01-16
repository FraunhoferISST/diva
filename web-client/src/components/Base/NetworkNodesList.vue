<template>
  <div>
    <slot
      :totalNetworkEntitiesCount="totalNetworkEntitiesCount"
      :load="load"
      :entities="entitiesList"
    ></slot>
    <data-viewer :loading="loading" :error="error">
      <v-container fluid class="px-0 relative pt-0">
        <v-row v-if="entitiesList.length === 0" class="mt-3">
          <v-col cols="12">
            <no-data-state />
          </v-col>
        </v-row>
        <v-row dense v-else class="mt-3">
          <v-col cols="12" class="py-3" v-if="showCounter">
            {{ totalNetworkEntitiesCount }} in total
          </v-col>
          <v-col
            cols="12"
            :md="fullWidth ? '12' : '6'"
            v-for="entity in entitiesList"
            :key="entity.id"
            class="d-flex"
          >
            <slot name="item" :entity="entity" :load="load">
              <entity-mini-card
                class="fill-height full-width"
                :entity="entity"
                :visible="entity.visible"
              />
            </slot>
          </v-col>
        </v-row>
        <v-row dense class="mt-6" v-if="cursor && !(maxItems >= 0)">
          <v-col cols="12" class="text-center">
            <v-btn
              text
              light
              small
              color="primary"
              rounded
              :loading="nextPagLoading"
              @click="loadNextPage"
            >
              load more
            </v-btn>
          </v-col>
        </v-row>
        <v-snackbar fixed bottom text v-model="snackbar" :color="color">
          <b>
            {{ message }}
          </b>
        </v-snackbar>
      </v-container>
    </data-viewer>
  </div>
</template>

<script>
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useSnackbar } from "@/composables/snackbar";
import { ref } from "@vue/composition-api";
import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import EntityMiniCard from "@/components/Entity/EntityMiniCard";
import NoDataState from "@/components/Base/NoDataState";

export default {
  name: "NetworkNodesList",
  components: {
    NoDataState,
    EntityMiniCard,
    DataViewer,
  },
  props: {
    id: {
      type: String,
      required: false,
    },
    toId: {
      type: String,
      required: false,
    },
    edgeTypes: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      default: "",
    },
    showCounter: {
      type: Boolean,
      default: true,
    },
    bidirectional: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    maxItems: {
      type: Number,
    },
  },
  setup(props) {
    const entitiesList = ref([]);
    const cursor = ref(null);
    const totalNetworkEntitiesCount = ref(0);
    const { show, message, color, snackbar } = useSnackbar();
    const { datanetwork, getEntityApiById } = useApi();
    const { request, loading, error } = useRequest();
    const {
      request: nextPagReq,
      loading: nextPagLoading,
      error: nextPageError,
    } = useRequest();
    const loadNetworkEntities = (_cursor = cursor.value) =>
      datanetwork
        .getEdges({
          from: props.id,
          to: props.toId,
          edgeTypes: props.edgeTypes,
          pageSize: props.maxItems ?? 20,
          bidirectional: props.bidirectional,
          ...(_cursor ? { cursor: cursor.value } : {}),
          ...(props.entityType ? { toNodeType: props.entityType } : {}),
        })
        .then(async ({ data: { collection, ...rest } }) => ({
          ...rest,
          collection: await Promise.all(
            collection.map(
              ({
                to: { entityId: toEntityId },
                from: { entityId: fromEntityId },
                properties: { id: edgeId },
              }) => {
                const toId =
                  fromEntityId === props.id || toEntityId !== props.toId
                    ? toEntityId
                    : fromEntityId;
                return getEntityApiById(toId)
                  .getByIdIgnoringErrors(toId, {
                    onIgnoredError: () => ({
                      id: toId,
                      visible: false,
                    }),
                  })
                  .then((response) => ({
                    id: toId,
                    ...(response?.data ?? response ?? {}),
                    edgeId,
                  }));
              }
            )
          ),
        }));
    const load = () =>
      request(
        loadNetworkEntities("").then(({ collection, total, cursor: c }) => {
          entitiesList.value = collection;
          totalNetworkEntitiesCount.value = total;
          cursor.value = c;
        })
      );
    load();
    return {
      entitiesList,
      totalNetworkEntitiesCount,
      loading,
      error,
      nextPagLoading,
      nextPageError,
      message,
      snackbar,
      color,
      cursor,
      load,
      loadNextPage: () =>
        nextPagReq(
          loadNetworkEntities().then(({ collection, cursor: c }) => {
            entitiesList.value.push(...collection);
            cursor.value = c;
          })
        ).then(() => {
          if (nextPageError.value) {
            show(
              nextPageError.value.response?.data?.message ??
                nextPageError.value,
              {
                color: "error",
              }
            );
          }
        }),
    };
  },
};
</script>

<style lang="scss"></style>
