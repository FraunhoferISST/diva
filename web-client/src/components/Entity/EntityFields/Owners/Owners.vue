<template>
  <info-block title="Owners">
    <template #value>
      <field-editor
        :data="{ owners: owners }"
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
                    style="
                      border-radius: 50%;
                      padding: 2px;
                      background-color: white;
                      width: 36px;
                      position: relative;
                    "
                  >
                    <entity-avatar
                      :image-id="owner.entityIcon || ''"
                      :entity-id="owner.id"
                      :entity-title="owner.username"
                    />
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
import DataViewer from "@/components/DataFetchers/DataViewer";
import OwnersEdit from "@/components/Entity/EntityFields/Owners/OwnersEdit";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";

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
  setup() {
    const { data, loading, error, request } = useRequest();
    return {
      data,
      error,
      request,
      loading,
    };
  },
  data: () => ({
    owners: [],
  }),
  methods: {
    fetchOwners() {
      return this.request(
        this.$api.datanetwork
          .getEdges({
            from: this.id,
            edgeTypes: "isOwnerOf",
            bidirectional: true,
          })
          .then(async ({ data: { collection } }) => {
            this.owners = (
              await Promise.all(
                // remember: user - isOwnerOf -> entity, so from contains the user id
                collection.map(({ from: { entityId: userId }, id }) =>
                  this.$api.users
                    .getByIdIfExists(userId, {
                      fields: "id, email, username, entityIcon",
                    })
                    .then(({ data }) => ({ ...data, edgeId: id }))
                )
              )
            ).filter((owner) => owner);
          })
      );
    },
    connectOwner({ owners }) {
      const removedOwners = this.owners.filter(
        ({ id }) => !owners.includes(id)
      );

      const removePromises = removedOwners.map(({ edgeId }) =>
        this.$api.datanetwork.deleteEdgeById(edgeId)
      );
      return Promise.all([
        ...owners.map((id) =>
          this.$api.datanetwork
            .postEdge({
              from: id,
              to: this.id,
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
    },
  },
};
</script>

<style scoped lang="scss">
.owner-avatar {
  width: 22px;
}
</style>
