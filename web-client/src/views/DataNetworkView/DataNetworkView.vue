<template>
  <data-network
    :edges="edgesDataSet"
    :nodes="nodesDataSet"
    @click="eventHandler"
    @doubleClick="eventHandler"
    @oncontext="eventHandler"
    @hold="eventHandler"
    @release="eventHandler"
    @select="eventHandler"
    @selectEdge="eventHandler"
    @selectNode="selectNodeEventHandler"
    @deselectNode="eventHandler"
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
</template>

<script>
import DataNetwork from "@/components/DataNetwork/DataNetwork";
import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { ref, reactive, onMounted } from "@vue/composition-api";
import { DataSet, DataView } from "vis-data/esnext";
import randomColor from "@/utils/colors";

const testUuid = "user:uuid:303efeef-6b75-41c7-b23a-1829db17eb19";
const nodeColors = randomColor(100);
/*physics: {
  stabilization: false,
      barnesHut: {
    gravitationalConstant: -30000,
        springConstant: 0.04,
        springLength: 0.5,
  },
},
interaction: {
  tooltipDelay: 200,
      hideEdgesOnDrag: true,
      hideEdgesOnZoom: true,
},*/

export default {
  name: "DataNetworkView",
  components: {
    DataNetwork,
  },
  methods: {
    eventHandler(data) {
      // console.log(data);
    },
  },
  setup() {
    const nodesDataSet = reactive(new DataSet());
    const edgesDataSet = reactive(new DataSet());
    const { datanetwork, getEntityApiById } = useApi();
    const { request, loading, error } = useRequest();
    const requestSubGraph = async (entityId) => {
      await request(
        datanetwork
          .getEdges({ from: entityId, bidirectional: true, pageSize: 200 })
          .then(async (res) => {
            for (const edge of res.data.collection) {
              if (edgesDataSet.get(edge.properties.id) === null) {
                try {
                  edgesDataSet.update({
                    id: edge.properties.id,
                    from: edge.from.entityId,
                    to: edge.to.entityId,
                    label: edge.edgeType,
                    title: edge.edgeType,
                  });
                } catch (e) {
                  //console.log(e);
                }
              }

              if (nodesDataSet.get(edge.from.entityId) === null) {
                const resolvedFromNode = await getEntityApiById(
                  edge.from.entityId
                )
                  .getByIdIfExists(edge.from.entityId)
                  .catch((e) => {
                    if (e?.response?.status === 403) {
                      return null;
                    }
                  });
                if (resolvedFromNode !== null) {
                  try {
                    nodesDataSet.update({
                      id: resolvedFromNode.data.id,
                      label:
                        resolvedFromNode.data.title ||
                        resolvedFromNode.data.username,
                    });
                  } catch (e) {
                    //
                  }
                }
              }

              if (nodesDataSet.get(edge.to.entityId) === null) {
                const resolvedToNode = await getEntityApiById(edge.to.entityId)
                  .getByIdIfExists(edge.to.entityId)
                  .catch((e) => {
                    if (e?.response?.status === 403) {
                      return null;
                    }
                  });
                if (resolvedToNode !== null) {
                  try {
                    nodesDataSet.update({
                      id: resolvedToNode.data.id,
                      label:
                        resolvedToNode.data.title ||
                        resolvedToNode.data.username,
                    });
                  } catch (e) {
                    //
                  }
                }
              }
            }
          })
      );
    };

    onMounted(async () => {
      await requestSubGraph(testUuid);
    });

    return {
      requestSubGraph,
      nodesDataSet,
      edgesDataSet,
      loading,
      error,
      selectNodeEventHandler: async (data) => {
        await requestSubGraph(data.nodes[0]);
      },
    };
  },
};
</script>

<style scoped></style>
