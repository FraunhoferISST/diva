<template>
  <div class="datanetwork">
    <v-progress-linear
      v-model="dataNetworkLoadingProcess"
      :active="dataNetworkLoading"
      :indeterminate="dataNetworkPreLoading"
      :query="true"
      height="5"
      absolute
      top
      color="primary"
    ></v-progress-linear>
    <data-network
      :edges="edgesDataView"
      :nodes="nodesDataView"
      @click="eventHandler"
      @doubleClick="eventHandler"
      @oncontext="eventHandler"
      @hold="eventHandler"
      @release="eventHandler"
      @select="eventHandler"
      @selectEdge="eventHandler"
      @selectNode="selectNodeEventHandler"
      @deselectNode="deselectNodeEventHandler"
      @deselectEdge="eventHandler"
      @dragStart="eventHandler"
      @dragging="eventHandler"
      @dragEnd="eventHandler"
      @hoverNode="eventHandler"
      @blurNode="eventHandler"
      @hoverEdge="eventHandler"
      @blurEdge="eventHandler"
      @zoom="eventHandler"
      @showPopup="eventHandler"
      @hidePopup="eventHandler"
      @startStabilizing="eventHandler"
      @stabilizationProgress="eventHandler"
      @stabilizationIterationsDone="eventHandler"
      @stabilized="eventHandler"
      @resize="eventHandler"
      @initRedraw="eventHandler"
      @beforeDrawing="eventHandler"
      @afterDrawing="eventHandler"
      @animationFinished="eventHandler"
      @configChange="eventHandler"
    ></data-network>
    <v-container>
      <v-row>
        <v-col cols="12" sm="4" md="3" lg="2">
          <v-btn
            color="primary"
            block
            v-if="selectedNodeId"
            @click="clickRequestSubGraph"
          >
            Load Subgraph
          </v-btn>
        </v-col>
        <v-col cols="12" sm="4" md="3" lg="2">
          <v-btn
            color="primary"
            block
            v-if="selectedNodeId"
            @click="clickNavigateToEntity"
          >
            Navigate to Entity
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DataNetwork from "@/components/DataNetwork/DataNetwork";
import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { ref, reactive, onMounted } from "@vue/composition-api";
import { DataSet, DataView } from "vis-data/esnext";
import randomColor from "@/utils/colors";
import paginator from "@/utils/paginator";
import entityTypeById from "@/utils/entityTypeById";
import routeHelper from "@/utils/routeHelper";

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
  methods: {
    eventHandler(data) {
      //console.log(data);
    },
  },
  setup(props, { root }) {
    const nodesDataSet = reactive(new DataSet());
    const nodesDataView = reactive(
      new DataView(nodesDataSet, {
        filter: (item) => {
          return true;
        },
      })
    );
    const edgesDataSet = reactive(new DataSet());
    const edgesDataView = reactive(
      new DataView(edgesDataSet, {
        filter: (item) => {
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
    const { loading, error } = useRequest();

    const resolveNode = (id) =>
      getEntityApiById(id)
        .getByIdIfExists(id)
        .catch((e) => {
          if (e?.response?.status === 403) {
            return null;
          }
        });

    resolveNode(props.id).then((response) => {
      if (response?.data) {
        nodesDataSet.update(createNodeObject(response.data, 0));
      }
    });

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
      requestSubGraph,
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
          console.log(e);
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
        //root.$router.push({ path });
      },
    };
  },
};
</script>

<style scoped lang="scss">
div.datanetwork {
  height: 70vh;
  width: 100%;
  border: 2px solid #f0f4f9;
  position: relative;
}
</style>
