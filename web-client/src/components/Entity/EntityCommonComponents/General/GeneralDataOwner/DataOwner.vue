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
              :class="{ test: i > 0 }"
              :style="{ left: i > 0 ? `-${i * 10}px` : '0px' }"
              v-for="(dataOwner, i) in dataOwners"
              :key="dataOwner.id"
            >
              <user-avatar :image-id="dataOwner.imageId" />
            </div>
          </template>
          <user-link v-else :user="dataOwners[0]" />
        </div>
        <no-data-state v-else text="Assign a data owner" />
      </data-fetcher>
    </template>
    <template #edit="{ setEditedData }">
      <general-data-owner-edit
        :ownerId="dataOwners || ''"
        :owner="dataOwners"
        @update:owner="setEditedData($event)"
      />
    </template>
  </edit-view-content>
</template>

<script>
import EditViewContent from "@/components/Containers/EditViewContent";
import GeneralDataOwnerEdit from "@/components/Entity/EntityCommonComponents/General/GeneralDataOwner/GeneralDataOwnerEdit";
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
          types: "isDataOwnerOf",
          bidirectional: true,
        })
        .then(async ({ data: { collection } }) => {
          this.dataOwners = (
            await Promise.all(
              collection.map(({ id }) =>
                this.$api.users
                  .getByIdIfExists(id, {
                    fields: "id, email, username, imageId, imageUrl",
                  })
                  .then(({ data }) => data)
              )
            )
          ).filter((dataOwner) => dataOwner);
        });
    },
    connectDataOwner(userId) {
      return this.$api.datanetwork.putEdge({
        from: userId,
        to: this.id,
        type: "isDataOwnerOf",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.data-owner-avatar {
  padding: 2px;
  background-color: white;
  border-radius: 50%;
  &.test {
    position: relative;
    left: -10px;
  }
}
</style>
