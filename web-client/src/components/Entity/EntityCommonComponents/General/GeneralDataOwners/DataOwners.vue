<template>
  <edit-view-content
    :initialData="{ dataOwners: dataOwners }"
    :on-save="(patch) => connectDataOwner(patch)"
  >
    <template #view>
      <data-fetcher :fetch-method="fetchDataOwners">
        <div v-if="dataOwners.length > 0">
          <template v-if="dataOwners.length > 1">
            <div
              class="data-owner-avatar d-inline-block"
              v-for="dataOwner in dataOwners"
              :key="dataOwner.id"
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
                <user-avatar :image-id="dataOwner.imageId" />
              </div>
            </div>
          </template>
          <user-link v-else :user="dataOwners[0]" />
        </div>
        <no-data-state v-else text="Assign data owners" />
      </data-fetcher>
    </template>
    <template #edit="{ setEditedData }">
      <general-data-owner-edit
        :owners="dataOwners"
        @update:owners="setEditedData($event)"
      />
    </template>
  </edit-view-content>
</template>

<script>
import EditViewContent from "@/components/Containers/EditViewContent";
import GeneralDataOwnerEdit from "@/components/Entity/EntityCommonComponents/General/GeneralDataOwners/GeneralDataOwnersEdit";
import DataFetcher from "@/components/DataFetchers/DataFetcher";
import NoDataState from "@/components/Base/NoDataState";
import UserAvatar from "@/components/User/UserAvatar";
import UserLink from "@/components/Base/UserLink";
export default {
  name: "DataOwner",
  components: {
    UserLink,
    UserAvatar,
    NoDataState,
    DataFetcher,
    GeneralDataOwnerEdit,
    EditViewContent,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    dataOwners: [],
  }),
  methods: {
    fetchDataOwners() {
      return this.$api.datanetwork
        .getEdges({
          from: this.id,
          edgeTypes: "isDataOwnerOf",
          bidirectional: true,
        })
        .then(async ({ data: { collection } }) => {
          this.dataOwners = (
            await Promise.all(
              collection.map(({ to: { id: userId }, id }) =>
                this.$api.users
                  .getByIdIfExists(userId, {
                    fields: "id, email, username, imageId, imageUrl",
                  })
                  .then(({ data }) => ({ ...data, edgeId: id }))
              )
            )
          ).filter((dataOwner) => dataOwner);
        });
    },
    connectDataOwner({ owners }) {
      const removedDataOwners = this.dataOwners.filter(
        ({ id }) => !owners.includes(id)
      );

      const removePromises = removedDataOwners.map(({ edgeId }) =>
        this.$api.datanetwork.deleteEdgeById(edgeId)
      );
      return Promise.all([
        ...owners.map((id) =>
          this.$api.datanetwork
            .putEdge({
              from: id,
              to: this.id,
              edgeType: "isDataOwnerOf",
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
.data-owner-avatar {
  width: 22px;
}
</style>
