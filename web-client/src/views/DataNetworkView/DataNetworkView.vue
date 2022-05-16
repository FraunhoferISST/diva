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
import { useUser } from "@/composables/user";
import { DataSet, DataView } from "vis-data/esnext";
import randomColor from "@/utils/colors";
import paginator from "@/utils/paginator";

const testUuid = "user:uuid:303efeef-6b75-41c7-b23a-1829db17eb19";
const nodeColors = randomColor(100);

export default {
  name: "DataNetworkView",
  components: {
    DataNetwork,
  },
  props: {
    rootId: {
      type: String,
      required: false,
    },
    preloadDepth: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    eventHandler(data) {
      // console.log(data);
    },
  },
  setup(props) {
    const nodesDataSet = reactive(new DataSet());
    const edgesDataSet = reactive(new DataSet());
    const { datanetwork, getEntityApiById } = useApi();
    const { request, loading, error } = useRequest();
    const { user } = useUser();

    const resolveNode = (id) =>
      getEntityApiById(id)
        .getByIdIfExists(id)
        .catch((e) => {
          if (e?.response?.status === 403) {
            return null;
          }
        });

    resolveNode(props.rootId ?? user.value.id).then((response) => {
      if (response?.data) {
        nodesDataSet.update({
          id: response.data.id,
          label: response.data.title || response.data.username,
          level: 0,
        });
      }
    });

    const requestSubGraph = async (entityId, level) => {
      for await (const { collection } of paginator(
        datanetwork.getEdges,
        {
          from: entityId,
          bidirectional: true,
        },
        10
      )) {
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
            if (nodesDataSet.get(edge.to.entityId) === null) {
              return resolveNode(edge.to.entityId);
            }
          })
        );
        nodesDataSet.update(
          resolvedNodes
            .filter((node) => node)
            .map((node) => ({
              id: node.data.id,
              label: node.data.title || node.data.username,
            }))
        );
        for (const resolvedNode of resolvedNodes.filter((node) => node)) {
          if (level < props.preloadDepth) {
            await requestSubGraph(resolvedNode.data.id, level + 1);
          }
        }
      }
    };

    onMounted(async () => {
      if (props.preloadDepth) {
        await requestSubGraph(user.value.id, 1);
      }
    });

    return {
      requestSubGraph,
      nodesDataSet,
      edgesDataSet,
      loading,
      error,
      selectNodeEventHandler: async (data) => {
        const nodeData = nodesDataSet.get(data.nodes[0]);
        if (!nodeData.loaded) {
          await requestSubGraph(data.nodes[0], nodeData.level + 1);
          nodesDataSet.update({ ...nodeData, loaded: true });
        }
      },
    };
  },
};
</script>

<style scoped></style>
