<template>
  <div>
    <data-fetcher :fetch-method="fetchCreatorUser">
      <div class="d-flex align-center">
        <user-avatar :user-id="computedCreatorId" :image-id="creatorImageId" />
        <entity-details-link v-if="creatorExists" class="mx-1" :id="creator.id">
          {{ creatorName }}
        </entity-details-link>
        <span v-else class="history-card-title-creator mr-1">
          {{ creatorName }}
        </span>
        <span class="d-inline-block mx-2"> created at </span>
        <date-display :date="createdAt" />
      </div>
    </data-fetcher>
  </div>
</template>

<script>
import DataFetcher from "@/components/DataFetchers/DataFetcher";
import UserAvatar from "@/components/User/UserAvatar";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import DateDisplay from "@/components/Base/DateDisplay";
export default {
  name: "EntityCreator",
  components: { DateDisplay, EntityDetailsLink, UserAvatar, DataFetcher },
  props: {
    creatorId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    creator: null,
  }),
  computed: {
    computedCreatorId() {
      return this.creator?.id ?? "";
    },
    creatorName() {
      return this.creator?.username ?? "N/A";
    },
    creatorImageId() {
      return this.creator?.imageId ?? "";
    },
    creatorExists() {
      return !!this.creator;
    },
  },
  methods: {
    fetchCreatorUser() {
      return this.$api.users
        .getByIdIfExists(this.creatorId)
        .then((response) => (this.creator = response?.data));
    },
  },
};
</script>

<style scoped></style>
