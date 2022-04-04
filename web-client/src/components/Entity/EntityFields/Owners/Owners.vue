<template>
  <info-block title="Owners">
    <template #value>
      <field-editor
        :data="{ owners: loadedOwners }"
        :on-save="(patch) => connectOwner(patch)"
      >
        <template #view="{ state }">
          <data-viewer :loading="loading" :error="error">
            <div v-if="state.owners.length > 0">
              <template v-if="state.owners.length > 1">
                <div
                  class="data-owner-avatar d-inline-block"
                  v-for="owner in state.owners"
                  :key="owner.id"
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
                        :image-id="owner.entityIcon || ''"
                        :entity-id="owner.id"
                        :entity-title="owner.username"
                      />
                    </div>
                  </div>
                </div>
              </template>
              <user-link v-else :user="state.owners[0]" />
            </div>
            <no-data-state v-else text="Assign data owners" />
          </data-viewer>
        </template>
        <template #edit="{ setPatch, patch }">
          <owners-edit
            :owners="patch.owners"
            @update:owners="(newValue) => setPatch({ owners: newValue })"
          />
        </template>
      </field-editor>
    </template>
  </info-block>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import UserLink from "@/components/Base/UserLink";
import EntityAvatar from "@/components/Entity/EntityAvatar";
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
import { useRequest } from "@/composables/request";
import { useApi } from "@/composables/api";
import { useBus } from "@/composables/bus";
import DataViewer from "@/components/DataFetchers/DataViewer";
import OwnersEdit from "@/components/Entity/EntityFields/Owners/OwnersEdit";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import { ref } from "@vue/composition-api";

export default {
  name: "Owners",
  inheritAttrs: false,
  components: {
    InfoBlock,
    OwnersEdit,
    DataViewer,
    FieldEditor,
    EntityAvatar,
    UserLink,
    NoDataState,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const loadedOwners = ref([]);
    const { on } = useBus();
    const { datanetwork, users } = useApi();
    const { loading, error, request } = useRequest();

    const loadOwners = () =>
      request(
        datanetwork
          .getEdges({
            from: props.id,
            edgeTypes: "isOwnerOf",
            bidirectional: true,
          })
          .then(async ({ data: { collection } }) => {
            loadedOwners.value = (
              await Promise.all(
                // remember: user - isOwnerOf -> entity, so from contains the user id
                collection.map(
                  ({
                    from: { entityId: userId },
                    properties: { id: edgeId },
                  }) =>
                    users
                      .getByIdIfExists(userId, {
                        fields: "id, email, username, entityIcon",
                      })
                      .then(({ data }) => ({ ...data, edgeId }))
                )
              )
            ).filter((owner) => owner);
          })
      );
    const connectOwner = ({ owners }) => {
      const removedOwners = loadedOwners.value.filter(
        ({ id }) => !owners.map((o) => o.id).includes(id)
      );

      const newOwners = owners.filter(
        ({ id }) => !loadedOwners.value.map((o) => o.id).includes(id)
      );

      const removePromises = removedOwners.map(({ edgeId }) =>
        datanetwork.deleteEdgeById(edgeId).catch((e) => {
          if (e?.response?.data?.code === 404) {
            return true;
          }
          throw e;
        })
      );
      return Promise.all([
        ...newOwners.map(({ id }) =>
          datanetwork
            .postEdge({
              from: id,
              to: props.id,
              edgeType: "isOwnerOf",
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

    on("reload", loadOwners);
    loadOwners();
    return {
      loadedOwners,
      error,
      loading,
      connectOwner,
    };
  },
};
</script>

<style scoped lang="scss">
.owner-avatar {
  width: 22px;
}
</style>
