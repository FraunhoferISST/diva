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
            <v-col cols="12" class="d-flex justify-space-between">
              <custom-header> Destroy Subjects </custom-header>

              <v-tooltip top open-delay="600" max-width="400px">
                <template #activator="{ on, attrs }">
                  <v-icon
                    @click="
                      showDestroySubjectExplanation =
                        !showDestroySubjectExplanation
                    "
                    color="primary"
                    dense
                    v-bind="attrs"
                    v-on="on"
                  >
                    info_outline
                  </v-icon>
                </template>
                <span>Click here to show or hide explanation</span>
              </v-tooltip>
            </v-col>
            <v-col v-if="showDestroySubjectExplanation">
              <v-alert
                border="left"
                colored-border
                color="primary"
                elevation="5"
              >
                Resources whose life cycle end is to be modeled can be selected
                using the search field below. Added resources are displayed as
                tiles. Resources can be removed by clicking the Remove button.
                <br /><br />
                If multiple resources are selected, then as many of them as
                possible are to be deleted (DIVA will internally model it this
                way). If you want to delete only if all resources are present
                (e.g. on the personal computer) then this must be explicitly be
                modeled via Boolean algebra under "Destroy Claim Boolean
                Conditions (Expert Only)". This should only be done by someone
                who understands the underlying Destroy Claim Model
                Specification.
                <br /><br />
                Whether individual resources are selected as to be deleted can
                also be modeled with the expert conditions. To do this, click on
                the yellow "Expert Conditions" button. You will be redirected to
                the detail page of the DestroySubject. There you can perform the
                corresponding modeling. This should only be done by an expert.
              </v-alert>
            </v-col>
            <v-col cols="12">
              <entities-search
                title="Add new Destroy Subject to Destroy Claim"
                :includeEntityTypes="['resource']"
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
          <network-nodes-list
            :id="entity.id"
            edge-types="refersTo"
            :show-counter="false"
            :fullWidth="true"
          >
            <template #item="{ entity: innerEntity }">
              <destroy-subject-mini-card
                class="fill-height full-width"
                :entity="innerEntity"
                :destroySubject="entity"
                :visible="innerEntity.visible"
                :load="load"
              />
            </template>
          </network-nodes-list>
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
import { useApi, ref } from "@/composables/api";
import { useSnackbar } from "@/composables/snackbar";
import DestroySubjectMiniCard from "@/components/Entity/EntityFields/EntityField/DestroyClaims/DestroySubjectMiniCard";

export default {
  name: "DestroySubjects",
  components: {
    DestroySubjectMiniCard,
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
  data: () => {
    return {
      showDestroySubjectExplanation: false,
    };
  },
  setup(props) {
    const { snackbar, message, color, show } = useSnackbar();
    const { request, loading, error } = useRequest();
    const { datanetwork, entityApi } = useApi(props.id);
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
      addToDestroySubjects: async (
        entity,
        updateEntityMethod,
        reloadListMethod
      ) => {
        updateEntityMethod({ doc: { ...entity, loading: true } });

        return request(
          entityApi.create({
            title: `Destroy Subject of ${entity.id}`,
            destroyclaimType: "destroySubject",
            entityType: "destroyclaim",
            attributedTo: `${props.id},${entity.id}`,
          })
        ).then(() => {
          const unacceptableError =
            error.value && error.value?.response?.status !== 409;
          if (unacceptableError) {
            show(error.value, { color: "error" });
          } else {
            setTimeout(function () {
              reloadListMethod();
            }, 1000);
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
      bottom: 25px;
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
