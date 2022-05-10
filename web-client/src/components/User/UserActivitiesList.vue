<template>
  <data-viewer :loading="loading" :error="error">
    <v-container fluid class="px-0 relative">
      <v-row v-if="activityEntities.length === 0">
        <v-col cols="12">
          <no-data-state />
        </v-col>
      </v-row>
      <v-row dense v-else>
        <v-col cols="12" class="py-3">
          {{ totalActivityEntities }} in total
        </v-col>
        <v-col
          cols="12"
          md="6"
          v-for="entity in activityEntities"
          :key="entity.id"
          class="d-flex"
        >
          <entity-mini-card class="fill-height full-width" :entity="entity" />
        </v-col>
      </v-row>
      <v-row dense class="mt-6" v-if="cursor">
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
  name: "UserActivitiesList",
  components: {
    NoDataState,
    EntityMiniCard,
    DataViewer,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const activityEntities = ref([]);
    const cursor = ref(null);
    const totalActivityEntities = ref(0);
    const { show, message, color, snackbar } = useSnackbar();
    const { datanetwork, getEntityApiById } = useApi();
    const { request, loading, error } = useRequest();
    const {
      request: nextPagReq,
      loading: nextPagLoading,
      error: nextPageError,
    } = useRequest();
    const loadActivityEntities = () =>
      datanetwork
        .getEdges({
          from: props.id,
          edgeTypes: props.activity,
          pageSize: 20,
          ...(cursor ? { cursor: cursor.value } : {}),
          ...(props.entityType ? { toNodeType: props.entityType } : {}),
        })
        .then(async ({ data: { collection, ...rest } }) => ({
          ...rest,
          collection: await Promise.all(
            collection.map(({ to: { entityId } }) => {
              return getEntityApiById(entityId)
                .getByIdIfExists(entityId)
                .then(({ data }) => data)
                .catch((e) => {
                  if (e?.response?.data?.code === 403) {
                    return {
                      id: entityId,
                      isPrivate: true,
                    };
                  }
                  throw e;
                });
            })
          ),
        }));

    request(
      loadActivityEntities().then(({ collection, total, cursor: c }) => {
        activityEntities.value = collection;
        totalActivityEntities.value = total;
        cursor.value = c;
      })
    );
    return {
      activityEntities,
      totalActivityEntities,
      cursor,
      loading,
      error,
      nextPagLoading,
      nextPageError,
      message,
      snackbar,
      color,
      loadNextPage: () =>
        nextPagReq(
          loadActivityEntities().then(({ collection, cursor: c }) => {
            activityEntities.value.push(...collection);
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
