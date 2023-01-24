<template>
  <div>
    <v-divider></v-divider>
    <destroy-subjects :id="id" class="mt-5"></destroy-subjects>
    <v-divider class="mt-5"></v-divider>
    <destroy-conditions :id="id" class="mt-5"></destroy-conditions>
    <v-divider class="my-5"></v-divider>
  </div>
</template>

<script>
import { useRequest } from "@/composables/request";
import { useApi } from "@/composables/api";
import { useSnackbar } from "@/composables/snackbar";
import DestroySubjects from "@/components/Entity/EntityFields/EntityField/DestroyClaims/DestroySubjects";
import DestroyConditions from "@/components/Entity/EntityFields/EntityField/DestroyClaims/DestroyConditions";

export default {
  name: "DestroyClaimData",
  components: {
    DestroySubjects,
    DestroyConditions,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { snackbar, message, color, show } = useSnackbar();
    const { request, loading, error } = useRequest();
    const { datanetwork } = useApi();
    const removeFromDestroySubjects = (edgeId, reloadListMethod) => {
      return request(datanetwork.deleteEdgeById(edgeId)).then(() => {
        const unacceptableError =
          error.value && error.value?.response?.status !== 404;
        if (unacceptableError) {
          show(error.value, { color: "error" });
        } else {
          reloadListMethod();
        }
      });
    };
    return {
      loading,
      error,
      snackbar,
      message,
      color,
      addToDestroySubjects: (entity, updateEntityMethod, reloadListMethod) => {
        updateEntityMethod({ doc: { ...entity, loading: true } });
        return request(
          datanetwork.createEdge({
            from: entity.id,
            to: props.id,
            edgeType: "isDestroySubjectOf",
          })
        ).then(() => {
          const unacceptableError =
            error.value && error.value?.response?.status !== 409;
          if (unacceptableError) {
            show(error.value, { color: "error" });
          } else {
            reloadListMethod();
          }
          updateEntityMethod({
            doc: { ...entity, loading: false, added: !unacceptableError },
          });
        });
      },
      removeFromDestroySubjects,
      removeAllFromDestroySubjects(entities, reloadListMethod) {
        return Promise.all(
          entities.map(({ edgeId }) =>
            removeFromDestroySubjects(edgeId, () => {})
          )
        ).then(reloadListMethod);
      },
    };
  },
};
</script>

<style scoped lang="scss"></style>
