<template>
  <div style="position: relative; width: 100%; height: 100%">
    <div
      style="position: absolute; top: 0; right: 0; bottom: 0; left: 0"
      id="visualization"
      ref="visualization"
    />
  </div>
</template>

<script>
import { Network } from "vis-network/esnext";
import { DataSet, DataView } from "vis-data/esnext";

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
    destroy() {
      this.network.destroy();
    },
    setOptions(options) {
      this.network.setOptions(options);
    },
    on(event, callback) {
      this.network.on(event, callback);
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
