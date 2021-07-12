<template>
  <network
    class="network"
    ref="network"
    :nodes="normalizedNodes"
    :edges="edges"
    :options="options"
    :events="['click']"
  >
  </network>
</template>

<script>
import { Network } from "vue2vis";
import vars from "@/styles/vars.scss";

export default {
  name: "CsvNetwork",
  components: { Network },
  props: {
    nodes: {
      type: Array,
      required: true,
    },
    height: {
      type: String,
      required: false,
      default: "400",
    },
  },
  data() {
    return {
      options: {
        autoResize: true,
        height: this.height,
        width: "100%",
        interaction: {
          hover: false,
          tooltipDelay: 300,
        },
        /*layout: {
          randomSeed: undefined,
          improvedLayout:true,
          hierarchical: {
            enabled:true,
            levelSeparation: 150,
            nodeSpacing: 100,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'UD',        // UD, DU, LR, RL
            sortMethod: 'hubsize'   // hubsize, directed
          }
        },*/
        physics: {
          enabled: true,
          barnesHut: {
            avoidOverlap: 0,
            springLength: 200,
          },
        },
        nodes: {
          shadow: {
            enabled: true,
            color: "rgba(0,0,0,0.4)",
            size: 20,
            x: 5,
            y: 5,
          },
          font: {
            color: "white",
            size: 16, // px
            face: "Montserrat",
            background: "none",
            strokeWidth: 0, // px
            align: "center",
            multi: false,
            vadjust: 0,
          },
          shape: "box",
          borderWidth: 0,
          borderWidthSelected: 0,
          color: {
            background: vars.accentPrimary,
            border: vars.bgHover,
            highlight: {
              background: vars.accentSecondary,
              border: "transparent",
            },
          },
        },
        groups: {
          useDefaultGroups: false,
          root: {
            margin: 10,
            font: {
              size: 18,
            },
            color: {
              background: "#1f75fc",
              highlight: {
                background: vars.accentSecondary,
              },
            },
          },
          column: {
            color: {
              background: "#3a2f91",
              highlight: {
                background: vars.accentSecondary,
              },
            },
          },
        },
        edges: {
          width: 2,
          selectionWidth: 2,
          selfReferenceSize: 20,
          smooth: {
            enabled: true,
            type: "discrete",
            forceDirection: "vertical",
            roundness: 1,
          },
          color: {
            color: vars.accentPrimary,
            highlight: vars.accentSecondary,
            opacity: 0.4,
          },
          font: {
            color: "#343434",
            size: 12, // px
            face: "Montserrat",
            background: "none",
            strokeWidth: 2, // px
            strokeColor: "#ffffff",
            align: "horizontal",
            multi: false,
            vadjust: 0,
          },
          hoverWidth: 1.5,
          shadow: {
            enabled: true,
            color: "rgba(0,0,0,0.5)",
            size: 10,
            x: 2,
            y: 2,
          },
        },
      },
    };
  },
  computed: {
    normalizedNodes() {
      return this.nodes.map((node, id) => ({
        id,
        label: node.name,
        group: id === 0 ? "root" : "column", //first element in the array is the table-data file name
      }));
    },
    edges() {
      let edges = [];
      //all columns are pointing to the file name (root)
      for (let i = 1; i < this.nodes.length; i++) {
        edges.push({ from: 0, to: i });
      }
      return edges;
    },
  },
};
</script>

<style scoped lang="scss">
.vis-tooltip {
  padding: 5px;
  @include gradient-success;
  position: absolute;
  z-index: 100 !important;
  top: 0;
  left: 0;
  box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
  @include border-radius;
  @include font-style(1rem, $font_body, bold, rgba($bg_card, 1));
}
</style>
