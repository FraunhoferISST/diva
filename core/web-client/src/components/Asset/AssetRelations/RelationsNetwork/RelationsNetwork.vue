<template>
  <reactive-data-fetcher :fetch-method="fetchLinkedEntities" :id="id">
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
      <div class="relations-edit">
        <div>
          <relations-search-menu @addNodes="onNodesAdd" />
          <div
            class="remove-btn-container"
            :class="{ expanded: !!selectedNode }"
          >
            <v-btn
              :disabled="!!!selectedNode"
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
  </reactive-data-fetcher>
</template>

<script>
import { Network } from "vue2vis";
// import vars from "@/styles/vars.scss";
import RelationsSearchMenu from "@/components/Asset/AssetRelations/RelationsNetwork/RelationsSearchMenu";
import createNetworkNodeCard from "@/components/Asset/AssetRelations/RelationsNetwork/createNetworkNodeCard";
import ReactiveDataFetcher from "@/components/DataFetchers/ReactiveDataFetcher";
import { capFirstCharacter } from "@/utils";

export default {
  name: "RelationsNetwork",
  components: { ReactiveDataFetcher, RelationsSearchMenu, Network },
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
  data() {
    return {
      entities: [],
      selectedNode: "",
      snackbar: "",
      snackbarMessage: "",
      menu: false,
      options: {
        autoResize: true,
        height: this.height,
      },
    };
  },
  computed: {
    nodes() {
      return this.entities.map((entity) => ({
        ...entity,
        label: `${entity.isRoot ? "This root " : ""}${capFirstCharacter(
          entity.entityType ?? "N/A"
        )}`,
        ...(entity.isRoot ? { x: 0, y: 0, fixed: true } : { physics: true }),
        image: createNetworkNodeCard(entity),
        shape: "image",
      }));
    },
    edges() {
      return this.nodes.map((node) => ({
        from: node.isRoot ? "" : node.id,
        to: this.id,
      }));
    },
  },
  methods: {
    onNodesAdd(entities) {
      this.linkEntities(entities.map(({ id }) => ({ entityId: id })));
    },
    onSelectNodes(event) {
      const rootId = this.nodes.find((node) => node.isRoot).id;
      this.selectedNode = event.nodes.filter((id) => id !== rootId)[0];
    },
    async fetchLinkedEntities() {
      const rootAsset = (
        await this.$api.assets.getByIdIfExists(this.id, {
          fields: "id,title,entityType",
        })
      )?.data;
      const linkedEntities = await this.$api.assets
        .getEntities(this.id, {
          pageSize: 100,
        })
        .then(({ data: { collection } }) => {
          const promises = collection
            .filter((entityId) => entityId !== this.id)
            .map((entityId) => {
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
                }));
            });
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
    },
    linkEntities(entities) {
      this.$api.assets
        .addEntities(this.id, entities)
        .then(({ data }) => {
          const errors = data
            .filter(({ statusCode }) => statusCode !== 201)
            .map((response) => ({
              ...response,
              entity: this.entities.find(({ id }) => id === response.data),
            }));
          if (errors.length > 0) {
            this.showSnackbar(
              errors
                .map(
                  ({ entity, error }) =>
                    `Can not link "${entity.title}": ${error.message}`
                )
                .join("\n")
            );
          }
        })
        .catch((e) =>
          this.showSnackbar(e?.response?.data?.message || "Some error occurred")
        );
    },
    unlinkEntity() {
      this.$api.assets
        .deleteEntity(this.id, this.selectedNode)
        .catch((e) => this.showSnackbar(e?.message || "Some error occurred"));
    },
    showSnackbar(msg) {
      this.snackbarMessage = msg;
      this.snackbar = true;
    },
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
.relations-edit {
  position: absolute;
  @include border-radius;
  border-radius: 20px;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
  top: 0;
  background-color: white;
  margin: 2%;
}
.remove-btn-container {
  height: 0;
  transition: 0.3s;
  overflow: hidden;
  &.expanded {
    height: 36px;
  }
}
</style>
