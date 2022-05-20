<template>
  <div
    class="fill-height d-flex justify-center align-center pa-3 pa-md-12"
    style="height: calc(100vh - 70px)"
  >
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <v-alert dense text color="error" class="text-center ma-0">
            <p class="text-center ma-0">
              {{ errorMessage || "Some error occurred while loading data"
              }}<br />
              {{
                errorCode === 403 &&
                "It seems that according to the system policies the access to this this entity is not granted to you"
              }}
            </p>
          </v-alert>
        </v-col>
      </v-row>
      <data-viewer v-if="errorCode === 403" :loading="loading">
        <v-container v-if="!error && (creator || owner)" fluid class="mt-5">
          <v-row>
            <v-col cols="12">
              Contact the following entity owners to get access to it:
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6" v-if="creator">
                  <actor-card :actor="creator" />
                </v-col>
                <v-col cols="12" md="6" v-if="owner && owner.id !== creator.id">
                  <actor-card :actor="owner" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </data-viewer>
    </v-container>
  </div>
</template>

<script>
import { useRequest } from "@/composables/request";
import { useApi } from "@/composables/api";
import { ref } from "@vue/composition-api";
import DataViewer from "@/components/DataFetchers/DataViewer";
import ActorCard from "@/components/User/ActorCard";
export default {
  name: "EntityDetailsContainerAccessError",
  components: { ActorCard, DataViewer },
  props: {
    id: {
      type: String,
      required: true,
    },
    errorMessage: {
      type: String,
      required: true,
    },
    errorCode: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const creator = ref(null);
    const owner = ref(null);
    const { request, loading, error } = useRequest();
    const { datanetwork, users } = useApi(props.id);
    const loadResponsibleUser = (edgeType) =>
      datanetwork
        .getEdges({
          from: props.id,
          edgeTypes: edgeType,
          bidirectional: true,
        })
        .then(
          ({
            data: {
              collection: [edge],
            },
          }) =>
            edge?.from?.entityId
              ? users.getByIdIgnoringErrors(edge?.from?.entityId, {
                  query: { fields: "id,username,email,entityType" },
                  errorsToIgnore: [404, 403],
                })
              : null
        )
        .then((response) => response?.data);

    request(
      (async () => {
        const [_creator, _owner] = await Promise.all([
          loadResponsibleUser("isCreatorOf").catch(),
          loadResponsibleUser("isOwnerOf").catch(),
        ]);
        creator.value = _creator;
        owner.value = _owner;
      })()
    );
    return {
      loading,
      error,
      creator,
      owner,
    };
  },
};
</script>

<style scoped lang="scss"></style>
