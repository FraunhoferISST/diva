<template>
  <div>
    <data-viewer :loading="loading" :error="error">
      <div class="d-flex align-center">
        <entity-avatar
          :entity-id="computedCreatorId"
          :image-id="creatorImageId"
          :entity-title="creatorName"
        />
        <entity-details-link v-if="creatorExists" class="mx-1" :id="creator.id">
          {{ creatorName }}
        </entity-details-link>
        <span v-else class="history-card-title-creator mr-1">
          {{ creatorName }}
        </span>
        <span class="d-inline-block mx-2"> created at </span>
        <date-display :date="createdAt" />
      </div>
    </data-viewer>
  </div>
</template>

<script>
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import DateDisplay from "@/components/Base/DateDisplay";
import EntityAvatar from "@/components/Entity/EntityAvatar";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useRequest } from "@/composables/request";
import { useUser } from "@/composables/user";
export default {
  name: "EntityCreator",
  components: {
    DataViewer,
    EntityAvatar,
    DateDisplay,
    EntityDetailsLink,
  },
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
  setup() {
    const { request, loading, error } = useRequest();
    const { user } = useUser();
    return {
      request,
      loading,
      error,
      user,
    };
  },
  data: () => ({
    creator: null,
  }),
  computed: {
    computedCreatorId() {
      return this.creator?.id ?? "";
    },
    creatorName() {
      if (this.user.id === this.computedCreatorId) {
        return "You";
      }
      return this.creator?.username ?? "N/A";
    },
    creatorImageId() {
      return this.creator?.entityIcon ?? "";
    },
    creatorExists() {
      return !!this.creator;
    },
  },
  methods: {
    fetchCreatorUser() {
      return this.request(
        this.$api.users
          .getByIdIfExists(this.creatorId)
          .then((response) => (this.creator = response?.data))
      );
    },
  },
};
</script>

<style scoped></style>
