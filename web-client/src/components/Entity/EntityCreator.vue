<template>
  <data-viewer :loading="loading" :error="error">
    <actor-card :actor="creator || {}" dense>
      <template>
        <span class="d-none d-sm-inline-block mx-2"> created at </span>
        <date-display :date="createdAt" />
      </template>
    </actor-card>
  </data-viewer>
</template>

<script>
import DateDisplay from "@/components/Base/DateDisplay";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useRequest } from "@/composables/request";
import { useUser } from "@/composables/user";
import { useApi } from "@/composables/api";
import ActorCard from "@/components/User/ActorCard";
import { ref } from "@vue/composition-api";
export default {
  name: "EntityCreator",
  components: {
    ActorCard,
    DataViewer,
    DateDisplay,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const creator = ref({});
    const { datanetwork, users } = useApi();
    const { request, loading, error } = useRequest();
    const { user } = useUser();
    request(
      datanetwork
        .getEdges({
          from: props.id,
          edgeTypes: "isCreatorOf",
          bidirectional: true,
        })
        .then(({ data: { collection } }) => {
          if (collection.length > 0) {
            const creatorId = collection[0]?.from?.entityId;
            return users.getByIdIfExists(creatorId);
          }
          return {};
        })
        .then((response) => (creator.value = response?.data ?? {}))
    );
    return {
      creator,
      loading,
      error,
      user,
    };
  },
};
</script>

<style scoped></style>
