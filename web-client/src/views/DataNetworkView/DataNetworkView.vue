<template>
  <data-network
    :edges="edges"
    :nodes="nodes"
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
import { ref, onMounted } from "@vue/composition-api";

const testUuid = "user:uuid:dd7a9c22-bc5a-4c2a-9503-0dc41c4af77d";
const getUniqueArray = (arr) => {
  return arr.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);
};

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
    const nodes = ref([]);
    const edges = ref([]);
    const { datanetwork, getEntityApiById } = useApi();
    const { request, loading, error } = useRequest();
    const requestSubGraph = async (entityId) => {
      let _edges = [];
      let _nodes = [];
      await request(
        datanetwork
          .getEdges({ from: entityId, bidirectional: true, pageSize: 200 })
          .then(async (res) => {
            _edges = res.data.collection.map(
              ({
                from: { entityId: fromId },
                to: { entityId: toId },
                edgeType,
                properties,
              }) => ({
                id: properties.id,
                from: fromId,
                to: toId,
                label: edgeType,
                title: edgeType,
              })
            );

            for (const edge of _edges) {
              const resolvedFromNode = await getEntityApiById(edge.from)
                .getByIdIfExists(edge.from)
                .catch((e) => {
                  if (e?.response?.status === 403) {
                    return null;
                  }
                });
              if (resolvedFromNode !== null) {
                _nodes.push(resolvedFromNode.data);
              }

              const resolvedToNode = await getEntityApiById(edge.to)
                .getByIdIfExists(edge.to)
                .catch((e) => {
                  if (e?.response?.status === 403) {
                    return null;
                  }
                });
              if (resolvedToNode !== null) {
                _nodes.push(resolvedToNode.data);
              }
            }
            _nodes = getUniqueArray(
              _nodes.map(({ id, title, username }) => ({
                id,
                label: title || username,
              }))
            );
          })
      );
      return {
        _nodes,
        _edges,
      };
    };

    const mergeSubGraph = (_nodes, _edges) => {
      console.log(_nodes);
      console.log(_edges);
      nodes.value = getUniqueArray([...nodes.value, ..._nodes]);
      edges.value = getUniqueArray([...edges.value, ..._edges]);
    };

    onMounted(async () => {
      const { _nodes, _edges } = await requestSubGraph(testUuid);
      mergeSubGraph(_nodes, _edges);
    });

    return {
      requestSubGraph,
      mergeSubGraph,
      nodes,
      edges,
      loading,
      error,
      selectNodeEventHandler: async (data) => {
        const { _nodes, _edges } = await requestSubGraph(data.nodes[0]);
        mergeSubGraph(_nodes, _edges);
      },
    };
  },
};
</script>

<style scoped></style>
