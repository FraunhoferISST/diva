<template>
  <data-viewer :loading="loading" :error="error">
    <user-card :user="creator || {}" dense>
      <template>
        <span class="d-inline-block ml-2"> created at </span>
        <date-display :date="createdAt" />
      </template>
    </user-card>
  </data-viewer>
</template>

<script>
import DateDisplay from "@/components/Base/DateDisplay";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useRequest } from "@/composables/request";
import { useUser } from "@/composables/user";
import UserCard from "@/components/User/UserCard";
export default {
  name: "EntityCreator",
  components: {
    UserCard,
    DataViewer,
    DateDisplay,
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
    loadCreatorUser() {
      return this.request(
        this.$api.users
          .getByIdIfExists(this.creatorId)
          .then((response) => (this.creator = response?.data))
      );
    },
  },
  mounted() {
    this.loadCreatorUser();
  },
};
</script>

<style scoped></style>
