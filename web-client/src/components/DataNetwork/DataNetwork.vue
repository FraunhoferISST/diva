<template>
  <div style="position: relative; width: 100%; height: 100%">
    <div
      style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px"
      id="visualization"
      ref="visualization"
    />
  </div>
</template>

<script>
import { Network } from "vis-network/esnext";
import { DataSet, DataView } from "vis-data/esnext";

const arrayDiff = (arr1, arr2) => arr1.filter((x) => arr2.indexOf(x) === -1);

const mountVisData = (vm, propName) => {
  let data = vm[propName];
  // If data is DataSet or DataView we return early without attaching our own events
  if (!(vm[propName] instanceof DataSet || vm[propName] instanceof DataView)) {
    data = new DataSet(vm[propName]);
    // Rethrow all events
    data.on("*", (event, properties, senderId) =>
      vm.$emit(`${propName}-${event}`, { event, properties, senderId })
    );
    // We attach deep watcher on the prop to propagate changes in the DataSet
    const callback = (value) => {
      if (Array.isArray(value)) {
        const newIds = new DataSet(value).getIds();
        const diff = arrayDiff(vm.visData[propName].getIds(), newIds);
        vm.visData[propName].update(value);
        vm.visData[propName].remove(diff);
      }
    };

    vm.$watch(propName, callback, {
      deep: true,
    });
  }

  // Emitting DataSets back
  vm.$emit(`${propName}-mounted`, data);

  return data;
};

export default {
  name: "DataNetwork",
  props: {
    edges: {
      type: [Array, DataSet, DataView],
      default: () => [],
    },
    nodes: {
      type: [Array, DataSet, DataView],
      default: () => [],
    },
    events: {
      type: Array,
      default: () => [
        "click",
        "doubleClick",
        "oncontext",
        "hold",
        "release",
        "select",
        "selectNode",
        "selectEdge",
        "deselectNode",
        "deselectEdge",
        "dragStart",
        "dragging",
        "dragEnd",
        "hoverNode",
        "blurNode",
        "hoverEdge",
        "blurEdge",
        "zoom",
        "showPopup",
        "hidePopup",
        "startStabilizing",
        "stabilizationProgress",
        "stabilizationIterationsDone",
        "stabilized",
        "resize",
        "initRedraw",
        "beforeDrawing",
        "afterDrawing",
        "animationFinished",
        "configChange",
      ],
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    visData: {
      nodes: null,
      edges: null,
    },
    defaultOptions: {
      nodes: {
        size: 20,
        shape: "dot",
        borderWidth: 0,
      },
      edges: {
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 1,
            type: "arrow",
          },
        },
        color: {
          color: "#A9A9A9",
          highlight: "#A9A9A9",
          hover: "#A9A9A9",
        },
        hoverWidth: 0.5,
        smooth: {
          enabled: true,
          type: "dynamic",
          roundness: 0.5,
        },
        labelHighlightBold: false,
      },
      physics: {
        stabilization: false,
        barnesHut: {
          gravitationalConstant: -40000,
          springConstant: 0.08,
          springLength: 100,
        },
      },
      interaction: { tooltipDelay: 200, hideEdgesOnDrag: true },
    },
  }),
  watch: {
    options: {
      deep: true,
      handler(o) {
        this.network.setOptions({ ...this.defaultOptions, ...o });
      },
    },
  },
  created() {
    // This should be a Vue data property, but Vue reactivity kinda bugs Vis.
    // See here for more: https://github.com/almende/vis/issues/2524
    this.network = null;
  },
  methods: {
    setData(n, e) {
      this.visData.nodes = Array.isArray(n) ? new DataSet(n) : n;
      this.visData.edges = Array.isArray(e) ? new DataSet(e) : e;
      this.network.setData(this.visData);
    },
    destroy() {
      this.network.destroy();
    },
    getNode(id) {
      return this.visData.nodes.get(id);
    },
    getEdge(id) {
      return this.visData.edges.get(id);
    },
    setOptions(options) {
      this.network.setOptions(options);
    },
    on(event, callback) {
      this.network.on(event, callback);
    },
    off(event, callback) {
      this.network.off(event, callback);
    },
    once(event, callback) {
      this.network.once(event, callback);
    },
    canvasToDom(p) {
      return this.network.canvasToDOM(p);
    },
    domToCanvas(p) {
      return this.network.DOMtoCanvas(p);
    },
    redraw() {
      this.network.redraw();
    },
    setSize(w, h) {
      this.network.setSize(w, h);
    },
    cluster(options) {
      this.network.cluster(options);
    },
    clusterByConnection(nodeId, options) {
      this.network.clusterByConnection(nodeId, options);
    },
    clusterByHubsize(hubsize, options) {
      this.network.clusterByHubsize(hubsize, options);
    },
    clusterOutliers(options) {
      this.network.clusterOutliers(options);
    },
    findNode(id) {
      return this.network.findNode(id);
    },
    getClusteredEdges(baseEdgeId) {
      return this.network.clustering.getClusteredEdges(baseEdgeId);
    },
    getBaseEdge(clusteredEdgeId) {
      return this.network.clustering.getBaseEdge(clusteredEdgeId);
    },
    getBaseEdges(clusteredEdgeId) {
      return this.network.clustering.getBaseEdges(clusteredEdgeId);
    },
    updateEdge(startEdgeId, options) {
      this.network.clustering.updateEdge(startEdgeId, options);
    },
    updateClusteredNode(clusteredNodeId, options) {
      this.network.clustering.updateClusteredNode(clusteredNodeId, options);
    },
    isCluster(nodeId) {
      return this.network.isCluster(nodeId);
    },
    getNodesInCluster(clusterNodeId) {
      return this.network.getNodesInCluster(clusterNodeId);
    },
    openCluster(nodeId, options) {
      this.network.openCluster(nodeId, options);
    },
    getSeed() {
      return this.network.getSeed();
    },
    enableEditMode() {
      this.network.enableEditMode();
    },
    disableEditMode() {
      this.network.disableEditMode();
    },
    addNodeMode() {
      this.network.addNodeMode();
    },
    editNode() {
      this.network.editNode();
    },
    addEdgeMode() {
      this.network.addEdgeMode();
    },
    editEdgeMode() {
      this.network.editEdgeMode();
    },
    deleteSelected() {
      this.network.deleteSelected();
    },
    getPositions(nodeIds) {
      return this.network.getPositions(nodeIds);
    },
    storePositions() {
      this.network.storePositions();
    },
    moveNode(nodeId, x, y) {
      this.network.moveNode(nodeId, x, y);
    },
    getBoundingBox(nodeId) {
      return this.network.getBoundingBox(nodeId);
    },
    getConnectedNodes(nodeId, direction) {
      return this.network.getConnectedNodes(nodeId, direction);
    },
    getConnectedEdges(nodeId) {
      return this.network.getConnectedEdges(nodeId);
    },
    startSimulation() {
      this.network.startSimulation();
    },
    stopSimulation() {
      this.network.stopSimulation();
    },
    stabilize(iterations) {
      this.network.stabilize(iterations);
    },
    getSelection() {
      return this.network.getSelection();
    },
    getSelectedNodes() {
      return this.network.getSelectedNodes();
    },
    getSelectedEdges() {
      return this.network.getSelectedEdges();
    },
    getNodeAt(p) {
      return this.network.getNodeAt(p);
    },
    getEdgeAt(p) {
      return this.network.getEdgeAt(p);
    },
    selectNodes(nodeIds, highlightEdges) {
      this.network.selectNodes(nodeIds, highlightEdges);
    },
    selectEdges(edgeIds) {
      this.network.selectEdges(edgeIds);
    },
    setSelection(selection, options) {
      this.network.setSelection(selection, options);
    },
    unselectAll() {
      this.network.unselectAll();
    },
    getScale() {
      return this.network.getScale();
    },
    getViewPosition() {
      return this.network.getViewPosition();
    },
    fit(options) {
      this.network.fit(options);
    },
    focus(nodeId, options) {
      this.network.focus(nodeId, options);
    },
    moveTo(options) {
      this.network.moveTo(options);
    },
    releaseNode() {
      this.network.releaseNode();
    },
    getOptionsFromConfigurator() {
      return this.network.getOptionsFromConfigurator();
    },
  },
  mounted() {
    const container = this.$refs.visualization;
    this.network = new Network(
      container,
      { nodes: this.nodes, edges: this.edges },
      { ...this.defaultOptions, ...this.options }
    );
    this.events.forEach((eventName) => {
      this.network.on(eventName, (props) => {
        this.$emit(eventName, { ...props, eventName });
      });
    });
  },
  beforeDestroy() {
    this.network.destroy();
  },
};
</script>

<style scoped>
#visualization {
  height: 100%;
}
</style>
