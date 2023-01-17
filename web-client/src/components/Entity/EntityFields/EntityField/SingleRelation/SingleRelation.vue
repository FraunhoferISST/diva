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
        :data="{ entity: loadedEntity }"
        :on-save="(patch) => connectEntity(patch)"
      >
        <template #view="{ state }">
          <data-viewer :loading="loading" :error="error">
            <div v-if="state.entity">
              <v-chip class="ml-1 mb-1" label small
                ><entity-link :entity="state.entity" :showAvatar="true"
              /></v-chip>
            </div>
            <no-data-state v-else text="Assign entity" />
          </data-viewer>
        </template>
        <template #edit="{ setPatch, patch }">
          <single-relation-edit
            :id="id"
            :entity="patch.entity"
            :entityType="fieldSchema._ui.SingleRelation.entityType"
            @update:entity="(newValue) => setPatch({ entity: newValue })"
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
import SingleRelationEdit from "@/components/Entity/EntityFields/EntityField/SingleRelation/SingleRelationEdit";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import { ref } from "@vue/composition-api";

export default {
  name: "SingleRelation",
  inheritAttrs: false,
  components: {
    InfoBlock,
    InfoBlockTitle,
    SingleRelationEdit,
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
    const loadedEntity = ref(null);
    const { on } = useBus();
    const { datanetwork, getEntityApiById } = useApi();
    const { loading, error, request } = useRequest();

    const query = {
      edgeTypes: props.fieldSchema._ui.SingleRelation.edgeType,
    };

    if (props.fieldSchema._ui.SingleRelation.edgeDirection === "from") {
      query.to = props.id;
      query.fromNodeType = props.fieldSchema._ui.SingleRelation.entityType;
    } else {
      query.from = props.id;
      query.toNodeType = props.fieldSchema._ui.SingleRelation.entityType;
    }

    if (props.fieldSchema._ui.SingleRelation.bidirectional) {
      query.bidirectional = true;
    }

    const loadEntity = () =>
      request(
        datanetwork.getEdges(query).then(async ({ data: { collection } }) => {
          if (collection.length > 0) {
            let entityId = "";
            const edgeId = collection[0].properties.id;

            // always show what is not the main entity
            if (props.id === collection[0].from.entityId) {
              entityId = collection[0].to.entityId;
            } else {
              entityId = collection[0].from.entityId;
            }
            /*
            if (props.fieldSchema._ui.SingleRelation.edgeDirection === "from") {
              entityId = collection[0].from.entityId;
            } else {
              entityId = collection[0].to.entityId; // SingleRelation -> there should only be one edge
            }*/

            loadedEntity.value = await getEntityApiById(entityId)
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
          } else {
            loadedEntity.value = null;
          }
        })
      );
    const connectEntity = async ({ entity }) => {
      const promises = [];
      if (loadedEntity.value && loadedEntity.value.id) {
        promises.push(
          datanetwork.deleteEdgeById(loadedEntity.value.edgeId).catch((e) => {
            if (e?.response?.data?.code === 404) {
              return true;
            }
            throw e;
          })
        );
      }

      if (entity && entity.id) {
        const query = {
          from: entity.id,
          edgeType: props.fieldSchema._ui.SingleRelation.edgeType,
        };
        if (props.fieldSchema._ui.SingleRelation.edgeDirection === "from") {
          query.to = props.id;
        } else {
          query.from = props.id;
        }

        promises.push(
          datanetwork.createEdge(query).catch((e) => {
            if (e?.response?.data?.code === 409) {
              return true;
            }
            throw e;
          })
        );
      }

      return Promise.all(promises);
    };

    on("reload", loadEntity);
    loadEntity();
    return {
      loadedEntity,
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
