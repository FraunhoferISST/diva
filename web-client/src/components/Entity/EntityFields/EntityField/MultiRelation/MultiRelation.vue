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
        :data="{ entities: loadedEntities }"
        :on-save="(patch) => connectEntity(patch)"
      >
        <template #view="{ state }">
          <data-viewer :loading="loading" :error="error">
            <div v-if="state.entities.length > 0">
              <template>
                <div
                  class="data-entity-avatar d-inline-block"
                  v-for="entity in state.entities"
                  :key="entity.id"
                >
                  <v-chip class="ml-1 mb-1" label small
                    ><entity-link :entity="entity" :showAvatar="true"
                  /></v-chip>
                </div>
              </template>
            </div>
            <no-data-state v-else text="Assign entity" />
          </data-viewer>
        </template>
        <template #edit="{ setPatch, patch }">
          <multi-relation-edit
            :id="id"
            :entities="patch.entities"
            :entityType="fieldSchema._ui.MultiRelation.entityType"
            @update:entities="(newValue) => setPatch({ entities: newValue })"
          />
        </template>
      </field-editor>
    </template>
  </info-block>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import EntityLink from "@/components/Base/EntityLink";
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
import { useRequest } from "@/composables/request";
import { useApi } from "@/composables/api";
import { useBus } from "@/composables/bus";
import DataViewer from "@/components/DataFetchers/DataViewer";
import MultiRelationEdit from "@/components/Entity/EntityFields/EntityField/MultiRelation/MultiRelationEdit";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import { ref } from "@vue/composition-api";

export default {
  name: "MultiRelation",
  inheritAttrs: false,
  components: {
    InfoBlock,
    InfoBlockTitle,
    MultiRelationEdit,
    DataViewer,
    FieldEditor,
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
    const loadedEntities = ref([]);
    const { on } = useBus();
    const { datanetwork, getEntityApiById } = useApi();
    const { loading, error, request } = useRequest();

    const query = {
      edgeTypes: props.fieldSchema._ui.MultiRelation.edgeType,
    };

    if (props.fieldSchema._ui.MultiRelation.edgeDirection === "from") {
      query.to = props.id;
      query.fromNodeType = props.fieldSchema._ui.MultiRelation.entityType;
    } else {
      query.from = props.id;
      query.toNodeType = props.fieldSchema._ui.MultiRelation.entityType;
    }

    if (props.fieldSchema._ui.MultiRelation.bidirectional) {
      query.bidirectional = true;
    }

    const loadEntities = () =>
      request(
        datanetwork.getEdges(query).then(async ({ data: { collection } }) => {
          loadedEntities.value = (
            await Promise.all(
              collection.map(
                ({
                  to: { entityId: entityIdTo },
                  from: { entityId: entityIdFrom },
                  properties: { id: edgeId },
                }) => {
                  let entityId = "";

                  // always show what is not the main entity
                  if (props.id === entityIdFrom) {
                    entityId = entityIdTo;
                  } else {
                    entityId = entityIdFrom;
                  }

                  return getEntityApiById(entityId)
                    .getByIdIfExists(entityId, {
                      fields: "id, title, username, entityIcon",
                    })
                    .then(({ data }) => ({ ...data, edgeId }))
                    .catch((e) => {
                      if (e?.response?.data?.code === 403) {
                        return {
                          edgeId,
                          entityId,
                        };
                      }
                      throw e;
                    });
                }
              )
            )
          ).filter((entity) => entity);
        })
      );
    const connectEntity = ({ entities }) => {
      const removedEntities = loadedEntities.value.filter(
        ({ id }) => !entities.map((o) => o.id).includes(id)
      );

      const newEntities = entities.filter(
        ({ id }) => !loadedEntities.value.map((o) => o.id).includes(id)
      );

      const removePromises = removedEntities.map(({ edgeId }) =>
        datanetwork.deleteEdgeById(edgeId).catch((e) => {
          if (e?.response?.data?.code === 404) {
            return true;
          }
          throw e;
        })
      );
      return Promise.all([
        ...newEntities.map(({ id }) => {
          const query = {
            edgeType: props.fieldSchema._ui.MultiRelation.edgeType,
          };
          if (props.fieldSchema._ui.MultiRelation.edgeDirection === "from") {
            query.to = props.id;
            query.from = id;
          } else {
            query.from = props.id;
            query.to = id;
          }
          return datanetwork.createEdge(query).catch((e) => {
            if (e?.response?.data?.code === 409) {
              return true;
            }
            throw e;
          });
        }),
        ...removePromises,
      ]);
    };

    on("reload", loadEntities);
    loadEntities();
    return {
      loadedEntities,
      error,
      loading,
      connectEntity,
    };
  },
};
</script>

<style scoped lang="scss">
.entity-avatar {
  width: 22px;
}
</style>
