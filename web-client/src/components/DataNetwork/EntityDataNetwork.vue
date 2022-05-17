<template>
  <data-viewer :loading="loading" :error="error">
    <div class="datanetwork-container relative">
      <v-snackbar v-model="snackbar" :color="color" absolute top>
        <b>
          {{ message }}
        </b>
      </v-snackbar>
      <div class="datanetwork">
        <v-progress-linear
          v-model="dataNetworkLoadingProcess"
          :active="dataNetworkLoading"
          :indeterminate="dataNetworkPreLoading"
          :query="true"
          height="5"
          rounded
          absolute
          top
          color="primary"
        ></v-progress-linear>
        <data-network
          :edges="edgesDataView"
          :nodes="nodesDataView"
          @selectNode="selectNodeEventHandler"
          @deselectNode="deselectNodeEventHandler"
        ></data-network>
      </div>
      <v-container v-if="selectedNodeId" fluid class="pa-0 pt-3">
        <v-row class="d-flex justify-end">
          <v-col cols="12" sm="4" md="3" lg="2" v-if="selectedNodeId !== id">
            <v-btn
              color="primary"
              rounded
              text
              block
              @click="clickNavigateToEntity"
            >
              Navigate to Entity
            </v-btn>
          </v-col>
          <v-col cols="12" sm="4" md="3" lg="2">
            <v-btn
              color="primary"
              class="gprimary"
              rounded
              block
              @click="clickRequestSubGraph"
            >
              Load Subgraph
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </data-viewer>
</template>

<script>
import DataNetwork from "@/components/DataNetwork/DataNetwork";
import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";
import { ref, reactive, onMounted } from "@vue/composition-api";
import { DataSet, DataView } from "vis-data/esnext";
import randomColor from "@/utils/colors";
import paginator from "@/utils/paginator";
import entityTypeById from "@/utils/entityTypeById";
import routeHelper from "@/utils/routeHelper";
import DataViewer from "@/components/DataFetchers/DataViewer";

const nodeColors = randomColor(100);

const entityColorMap = {
  resource: nodeColors[0],
  asset: nodeColors[1],
  user: nodeColors[2],
  service: nodeColors[3],
  review: nodeColors[4],
};

const createNodeObject = (entityData, level) => ({
  id: entityData.id,
  label: entityData.title || entityData.username,
  title: entityData.entityType,
  color: {
    background: entityColorMap[entityTypeById(entityData.id)],
  },
  level,
});

export default {
  name: "EntityDataNetwork",
  components: {
    DataViewer,
    DataNetwork,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    preloadDepth: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { root }) {
    const nodesDataSet = reactive(new DataSet());
    const nodesDataView = reactive(
      new DataView(nodesDataSet, {
        filter: (/*item*/) => {
          return true;
        },
      })
    );
    const edgesDataSet = reactive(new DataSet());
    const edgesDataView = reactive(
      new DataView(edgesDataSet, {
        filter: (/*item*/) => {
          return true;
        },
      })
    );

    const selectedNodeId = ref("");
    const dataNetworkLoading = ref(false);
    const dataNetworkPreLoading = ref(false);
    const dataNetworkLoadingProcess = ref(0);
    const pageSize = ref(10);

    const { datanetwork, getEntityApiById } = useApi();
    const { snackbar, message, color, show } = useSnackbar();
    const { request, loading, error } = useRequest();

    const resolveNode = (id) =>
      getEntityApiById(id)
        .getByIdIfExists(id)
        .catch((e) => {
          if (e?.response?.status === 403) {
            return null;
          }
          throw e;
        });

    request(
      resolveNode(props.id).then((response) => {
        if (response?.data) {
          nodesDataSet.update(createNodeObject(response.data, 0));
        }
      })
    );

    const requestSubGraph = async (entityId, level) => {
      let page = 0;

      for await (const { collection, total } of paginator(
        datanetwork.getEdges,
        {
          from: entityId,
          bidirectional: true,
        },
        pageSize.value
      )) {
        dataNetworkPreLoading.value = false;
        for (const edge of collection) {
          if (edgesDataSet.get(edge.properties.id) === null) {
            edgesDataSet.update({
              id: edge.properties.id,
              from: edge.from.entityId,
              to: edge.to.entityId,
              label: edge.edgeType,
              title: edge.edgeType,
              level,
            });
          }
        }
        const resolvedNodes = await Promise.all(
          collection.map((edge) => {
            const nodeIdToResolve =
              entityId === edge.from.entityId
                ? edge.to.entityId
                : edge.from.entityId;
            if (nodesDataSet.get(nodeIdToResolve) === null) {
              return resolveNode(nodeIdToResolve);
            }
          })
        );
        nodesDataSet.update(
          resolvedNodes
            .filter((node) => node)
            .map((node) => createNodeObject(node.data, level))
        );

        dataNetworkLoadingProcess.value = Math.ceil(
          (pageSize.value * page * 100) / total
        );

        page += 1;
        for (const resolvedNode of resolvedNodes.filter((node) => node)) {
          if (level < props.preloadDepth) {
            await requestSubGraph(resolvedNode.data.id, level + 1);
          }
        }
      }
    };

    onMounted(async () => {
      if (props.preloadDepth) {
        await requestSubGraph(props.id, 1);
      }
    });

    return {
      snackbar,
      message,
      color,
      nodesDataSet,
      nodesDataView,
      edgesDataSet,
      edgesDataView,
      selectedNodeId,
      dataNetworkLoading,
      dataNetworkPreLoading,
      dataNetworkLoadingProcess,
      loading,
      error,
      requestSubGraph,
      clickRequestSubGraph: async () => {
        try {
          dataNetworkLoading.value = true;
          dataNetworkPreLoading.value = true;
          const nodeData = nodesDataSet.get(selectedNodeId.value);
          if (!nodeData.loaded) {
            await requestSubGraph(selectedNodeId.value, nodeData.level + 1);
            nodesDataSet.update({
              ...nodeData,
              loaded: true,
            });
          }
        } catch (e) {
          show(e?.response?.data?.message || e, { color: "error" });
        } finally {
          dataNetworkLoading.value = false;
          dataNetworkPreLoading.value = false;
          dataNetworkLoadingProcess.value = 0;
        }
      },
      selectNodeEventHandler: async (data) => {
        const nodeData = nodesDataSet.get(data.nodes[0]);
        selectedNodeId.value = nodeData.id;
      },
      deselectNodeEventHandler: async () => {
        selectedNodeId.value = "";
      },
      clickNavigateToEntity: async () => {
        const path = routeHelper(selectedNodeId.value);
        const route = root.$router.resolve({ path });
        window.open(route.href);
      },
    };
  },
};
</script>

<style scoped lang="scss">
div.datanetwork {
  @include border-radius;
  overflow: hidden;
  height: calc(100vh - 315px);
  width: 100%;
  border: 2px solid #f0f4f9;
  position: relative;
}
</style>
