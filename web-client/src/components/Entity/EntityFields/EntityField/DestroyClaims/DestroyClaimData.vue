<template>
  <section id="destroy-subject-list">
    <network-nodes-list
      :toId="id"
      edge-types="isDestroySubjectOf"
      :show-counter="false"
    >
      <template #default="{ totalNetworkEntitiesCount, load, entities }">
        <v-container fluid class="pa-0">
          <v-row>
            <v-col cols="12">
              <custom-header> Destroy Subjects </custom-header>
            </v-col>
            <v-col cols="12">
              <entities-search
                title="Add new resource to the Destroy Claim"
                :includeEntityTypes="['resource', 'asset']"
              >
                <template #action="{ entity, updateEntity }">
                  <v-icon v-if="entity.added" dense color="green" right>
                    done
                  </v-icon>
                  <v-btn
                    v-else
                    small
                    text
                    rounded
                    color="primary"
                    :loading="entity.loading"
                    @click="
                      () => addToDestroySubjects(entity, updateEntity, load)
                    "
                  >
                    Add to Destroy Claim
                    <v-icon small right> add </v-icon>
                  </v-btn>
                </template>
              </entities-search>
            </v-col>
          </v-row>
        </v-container>
        <div class="mt-10 d-flex justify-space-between align-center">
          <span>
            {{ totalNetworkEntitiesCount }} Resourc{{
              totalNetworkEntitiesCount === 1 ? "e" : "es"
            }}
            in this Destroy Claim
          </span>
          <v-btn
            v-if="totalNetworkEntitiesCount > 0"
            rounded
            small
            text
            color="error"
            :loading="loading"
            @click="() => removeAllFromDestroySubjects(entities, load)"
          >
            Remove all
          </v-btn>
        </div>
      </template>
      <template #item="{ entity, load }">
        <div class="destroy-subject-item full-width relative">
          <entity-mini-card
            class="fill-height full-width"
            :entity="entity"
            :visible="entity.visible"
          />
          <div class="destroy-subject-item-btn d-flex justify-center">
            <v-btn
              small
              rounded
              color="error"
              :loading="loading"
              @click="() => removeFromDestroySubjects(entity.edgeId, load)"
            >
              Remove
            </v-btn>
          </div>
        </div>
      </template>
    </network-nodes-list>
    <v-snackbar v-model="snackbar" :color="color" fixed top>
      <b>{{ message }}</b>
    </v-snackbar>
  </section>
</template>

<script>
import NetworkNodesList from "@/components/Base/NetworkNodesList";
import CustomHeader from "@/components/Base/CustomHeader";
import EntitiesSearch from "@/components/Base/EntitiesSearch";
import { useRequest } from "@/composables/request";
import { useApi } from "@/composables/api";
import { useSnackbar } from "@/composables/snackbar";
import EntityMiniCard from "@/components/Entity/EntityMiniCard";

export default {
  name: "DestroyClaimData",
  components: {
    EntityMiniCard,
    EntitiesSearch,
    CustomHeader,
    NetworkNodesList,
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

<style scoped lang="scss">
.destroy-subject-item {
  &:hover {
    .destroy-subject-item-btn {
      bottom: 10px;
      opacity: 1;
    }
  }
}
.destroy-subject-item-btn {
  transition: 0.4s;
  position: absolute;
  opacity: 0;
  right: 10px;
  bottom: -20px;
}
</style>
