<template>
  <info-block :title="fieldSchema.title">
    <template #title v-if="fieldSchema.description">
      <info-block-title class="d-flex justify-space-between">
        {{ fieldSchema.title }}
        <template #info>
          <v-tooltip top open-delay="600" max-width="400px">
            <template #activator="{ on, attrs }">
              <v-icon color="primary" dense v-bind="attrs" v-on="on">
                info_outline
              </v-icon>
            </template>
            <span>{{ fieldSchema.description }}</span>
          </v-tooltip>
        </template>
      </info-block-title>
    </template>
    <template #value>
      <field-editor
        :data="{ resources: loadedResources }"
        :on-save="(patch) => connectResource(patch)"
      >
        <template #view="{ state }">
          <data-viewer :loading="loading" :error="error">
            <div v-if="state.resources.length > 0">
              <template v-if="state.resources.length > 1">
                <div
                  class="data-entity-avatar d-inline-block"
                  v-for="resource in state.resources"
                  :key="resource.id"
                >
                  <div
                    style="width: 20px; overflow: visible; position: relative"
                  >
                    <div
                      style="
                        width: 36px;
                        border-radius: 50%;
                        padding: 2px;
                        background-color: white;
                      "
                    >
                      <entity-avatar
                        :image-id="resource.entityIcon || ''"
                        :entity-id="resource.id"
                        :entity-title="resource.title"
                      />
                    </div>
                  </div>
                </div>
              </template>
              <entity-link v-else :entity="state.resources[0]" />
            </div>
            <no-data-state v-else text="Assign resources" />
          </data-viewer>
        </template>
        <template #edit="{ setPatch, patch }">
          <destroyclaim-refers-to-edit
            :resources="patch.resources"
            @update:resources="(newValue) => setPatch({ resources: newValue })"
          />
        </template>
      </field-editor>
    </template>
  </info-block>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import EntityLink from "@/components/Base/EntityLink";
import EntityAvatar from "@/components/Entity/EntityAvatar";
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
import { useRequest } from "@/composables/request";
import { useApi } from "@/composables/api";
import { useBus } from "@/composables/bus";
import DataViewer from "@/components/DataFetchers/DataViewer";
import DestroyclaimRefersToEdit from "@/components/Entity/EntityFields/EntityField/Destroyclaims/DestroyclaimRefersToEdit";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import { ref } from "@vue/composition-api";

export default {
  name: "DestroyclaimRefersTo",
  inheritAttrs: false,
  components: {
    InfoBlock,
    InfoBlockTitle,
    DestroyclaimRefersToEdit,
    DataViewer,
    FieldEditor,
    EntityAvatar,
    EntityLink,
    NoDataState,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    editable: {
      type: Boolean,
      required: true,
    },
    fieldSchema: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const loadedResources = ref([]);
    const { on } = useBus();
    const { datanetwork, resources } = useApi();
    const { loading, error, request } = useRequest();

    const loadResources = () =>
      request(
        datanetwork
          .getEdges({
            from: props.id,
            edgeTypes: "refersTo",
            bidirectional: true,
            toNodeType: "resource",
          })
          .then(async ({ data: { collection } }) => {
            loadedResources.value = (
              await Promise.all(
                collection.map(
                  ({
                    to: { entityId: resourceId },
                    properties: { id: edgeId },
                  }) =>
                    resources
                      .getByIdIfExists(resourceId, {
                        fields: "id, title, entityIcon",
                      })
                      .then(({ data }) => ({ ...data, edgeId }))
                      .catch((e) => {
                        if (e?.response?.data?.code === 403) {
                          return {
                            edgeId,
                            resourceId,
                          };
                        }
                        throw e;
                      })
                )
              )
            ).filter((resource) => resource);
          })
      );
    const connectResource = ({ resources }) => {
      const removedResources = loadedResources.value.filter(
        ({ id }) => !resources.map((o) => o.id).includes(id)
      );

      const newResources = resources.filter(
        ({ id }) => !loadedResources.value.map((o) => o.id).includes(id)
      );

      const removePromises = removedResources.map(({ edgeId }) =>
        datanetwork.deleteEdgeById(edgeId).catch((e) => {
          if (e?.response?.data?.code === 404) {
            return true;
          }
          throw e;
        })
      );
      return Promise.all([
        ...newResources.map(({ id }) =>
          datanetwork
            .createEdge({
              from: props.id,
              to: id,
              edgeType: "refersTo",
            })
            .catch((e) => {
              if (e?.response?.data?.code === 409) {
                return true;
              }
              throw e;
            })
        ),
        ...removePromises,
      ]);
    };

    on("reload", loadResources);
    loadResources();
    return {
      loadedResources,
      error,
      loading,
      connectResource,
    };
  },
};
</script>

<style scoped lang="scss">
.entity-avatar {
  width: 22px;
}
</style>
