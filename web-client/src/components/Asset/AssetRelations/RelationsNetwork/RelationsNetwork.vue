<template>
  <data-viewer :loading="loading" :error="error">
    <div class="relations-network">
      <network
        class="network"
        ref="network"
        :nodes="nodes"
        :edges="edges"
        @select-node="onSelectNodes"
        @deselect-node="onSelectNodes"
        :options="options"
        :events="['click', 'selectNode', 'deselectNode']"
      >
      </network>
      <div class="relations-edit-container d-flex">
        <div
          class="relations-edit d-flex"
          :style="{ width: `${controlsWidth}px` }"
        >
          <relations-search-menu @addNodes="onNodesAdd" />
          <div>
            <entity-details-link
              v-if="selectedNode.id"
              style="white-space: nowrap"
              target="_blank"
              ref="entityLink"
              class="px-3"
              :id="selectedNode.id || ''"
            >
              {{ selectedNode.label }}
            </entity-details-link>
            <v-btn
              :disabled="!!!selectedNode.id"
              text
              icon
              color="error"
              class="ma-0"
              @click="unlinkEntity"
            >
              <v-icon> remove </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <v-snackbar v-model="snackbar" absolute color="error" text timeout="10000">
      {{ snackbarMessage }}
    </v-snackbar>
  </data-viewer>
</template>

<script>
import { Network } from "vue2vis";
import RelationsSearchMenu from "@/components/Asset/AssetRelations/RelationsNetwork/RelationsSearchMenu";
import { capFirstCharacter } from "@/utils/utils";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useBus } from "@/composables/bus";
const bgColorMap = {
  resource: "#336FFCFF",
  asset: "#4d4cac",
  user: "#ff808b",
};

export default {
  name: "RelationsNetwork",
  components: {
    DataViewer,
    EntityDetailsLink,
    RelationsSearchMenu,
    Network,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: false,
      default: "400",
    },
  },
  setup() {
    const { on } = useBus();
    return {
      on,
    };
  },
  data() {
    return {
      loading: true,
      error: null,
      entities: [],
      selectedNode: {},
      snackbar: "",
      snackbarMessage: "",
      controlsWidth: 36,
      menu: false,
      options: {
        physics: {
          stabilization: true,
          barnesHut: {
            avoidOverlap: 0.5,
            springLength: 0,
            centralGravity: 0.8,
          },
        },
        autoResize: true,
        height: this.height,
        edges: {
          title: "hui",
          font: {
            color: "#343434",
            size: 14,
            face: "Montserrat",
          },
          smooth: false,
        },
        nodes: {
          font: "14px Quicksand white",
          shadow: {
            enabled: true,
            size: 10,
            color: "rgba(0,0,0,0.1)",
            x: 2,
            y: 2,
          },
          color: {
            border: "#5ea2ff",
            highlight: {
              border: "#4d2de0",
              background: "#2d87e0",
            },
          },
          heightConstraint: {
            minimum: 50,
          },
          widthConstraint: {
            minimum: 200,
          },
        },
      },
    };
  },
  computed: {
    nodes() {
      return this.entities.map((entity) => ({
        ...entity,
        label: this.shortenTitle(`${capFirstCharacter(entity.title ?? "N/A")}`),
        ...(entity.isRoot
          ? { x: 300, y: 300, fixed: true }
          : { physics: true }),
        shape: "box",
        color: {
          background: bgColorMap[entity.entityType],
        },
      }));
    },
    edges() {
      return this.nodes.map((node) => ({
        label: `${capFirstCharacter(node.entityType ?? "N/A")}`,
        from: node.isRoot ? "" : node.id,
        to: this.id,
        physics: false,
      }));
    },
  },
  methods: {
    onNodesAdd(entities) {
      this.linkEntities(entities.map(({ id }) => ({ entityId: id })));
    },
    onSelectNodes(event) {
      const rootId = this.nodes.find((node) => node.isRoot).id;
      const selectedId = event.nodes.filter((id) => id !== rootId)[0];
      this.selectedNode = this.nodes.find(({ id }) => id === selectedId) ?? {};
      this.$nextTick(() => {
        if (this.selectedNode.id) {
          this.controlsWidth = this.$refs.entityLink.$el.offsetWidth + 72;
        } else {
          this.controlsWidth = 36;
        }
      });
    },
    async loadLinkedEntities() {
      this.loading = true;
      try {
        const rootAsset = (
          await this.$api.assets.getByIdIfExists(this.id, {
            fields: "id,title,entityType",
          })
        )?.data;
        const linkedEntities = await this.$api.datanetwork
          .getEdges({
            from: this.id,
            edgeTypes: "isPartOf",
            bidirectional: true,
          })
          .then(({ data: { collection } }) => {
            const promises = collection.map(
              // remember: entity - isPartOf -> asset, so from contains the entity id
              ({ id: edgeId, from: { entityId } }) => {
                const entityType = entityId.slice(0, entityId.indexOf(":"));
                const api = this.$api[`${entityType}s`];
                return api
                  .getByIdIfExists(entityId, {
                    fields: "id,title,entityType,username",
                  })
                  .then((response) => ({
                    id: response?.data?.id ?? entityId,
                    title: response?.data?.title ?? response?.data?.username,
                    entityType: response?.data?.entityType,
                    edgeId,
                  }));
              }
            );
            return Promise.all(promises);
          });
        this.entities = [
          {
            ...rootAsset,
            label: rootAsset.title,
            isRoot: true,
          },
          ...linkedEntities,
        ];
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    linkEntities(entities) {
      const promises = [];
      for (const entity of entities) {
        if (entity.entityId !== this.id) {
          promises.push(
            this.$api.datanetwork
              .putEdge({
                from: entity.entityId,
                to: this.id,
                edgeType: "isPartOf",
              })
              .catch((e) =>
                this.showSnackbar(
                  e?.response?.data?.message || "Some error occurred"
                )
              )
          );
        }
      }
      Promise.all(promises).then(() => this.loadLinkedEntities());
    },
    unlinkEntity() {
      this.$api.datanetwork
        .deleteEdgeById(this.selectedNode.edgeId)
        .then(() => this.loadLinkedEntities())
        .catch((e) => this.showSnackbar(e?.message || "Some error occurred"));
    },
    showSnackbar(msg) {
      this.snackbarMessage = msg;
      this.snackbar = true;
    },
    shortenTitle(title) {
      return `${title.length > 45 ? title.slice(0, 45) + "..." : title}`;
    },
  },
  mounted() {
    this.loadLinkedEntities();
    this.on("reload", this.loadLinkedEntities);
  },
};
</script>

<style scoped lang="scss">
.network {
  height: 100%;
  @include border-radius-half;
}
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

div.relations-network {
  border: 2px solid #f0f4f9;
  @include border-radius;
  position: relative;
  & div.vis-manipulation {
    padding: 0 !important;
    @include border-radius-half;
    display: flex;
    flex-flow: row;
    align-content: center;
    background: white !important;
    height: 36px !important;
    width: 96% !important;
    top: 0;
    margin: 2%;
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
  }
}
.relations-edit-container {
  position: absolute;
  @include border-radius;
  top: 16px;
  left: 16px;
}
.relations-edit {
  transition: 0.3s;
  height: 36px;
  overflow: hidden;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
}
</style>
