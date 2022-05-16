<template>
  <div class="datanetwork">
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
  </div>
</template>

<script>
import DataNetwork from "@/components/DataNetwork/DataNetwork";
import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { reactive, onMounted } from "@vue/composition-api";
import { DataSet, DataView } from "vis-data/esnext";
import randomColor from "@/utils/colors";
import paginator from "@/utils/paginator";
import entityTypeById from "@/utils/entityTypeById";

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
      default: 1,
    },
  },
  methods: {
    eventHandler(data) {
      //console.log(data);
    },
  },
  setup(props) {
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

<style scoped lang="scss">
div.datanetwork {
  height: 70vh;
  width: 100%;
  border: 2px solid #f0f4f9;
  @include border-radius;
  position: relative;
}
</style>
