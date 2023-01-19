<template>
  <section id="user-general">
    <entity-general :id="id" />
    <data-viewer
      :loading="loading"
      :error="error"
      v-if="user.id === id || isAdmin"
    >
      <template v-if="data">
        <v-container class="pa-0 ma-0" fluid>
          <v-row class="pt-5">
            <v-col cols="12">
              <custom-header text="Account information" />
            </v-col>
            <v-col cols="12" v-if="user.id === id">
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="4">
                      <entity-field
                        :id="id"
                        :field-schema="{
                          title: 'Username',
                          propertyName: 'username',
                          isPatchable: true,
                          schema: {
                            properties: {
                              username: {
                                type: 'string',
                              },
                            },
                          },
                        }"
                        :value.sync="data.username"
                        mutate-source
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <info-block title="Email" :value="data.email">
                      </info-block>
                    </v-col>
                    <v-col cols="12" md="4">
                      <info-block title="Password" value="********">
                      </info-block>
                    </v-col>
                    <v-col cols="12">
                      <v-alert text dense color="info" class="mb-0">
                        You can edit your log in credentials on
                        <a :href="keycloakAccountURL"> Keycloak </a>
                        - our trusted and secure service for authentication
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" v-if="user.id === id || isAdmin">
              <v-alert text color="error" class="my-2">
                You can delete this DIVA account. Please note that the data
                cannot be restored. The data in Keycloak will not be affected by
                deleting this DIVA account.
                <div class="d-flex justify-end">
                  <v-btn
                    class="mt-3"
                    text
                    rounded
                    color="error"
                    @click="confirmationDialog = true"
                  >
                    Delete account
                  </v-btn>
                </div>
              </v-alert>
            </v-col>
          </v-row>
          <confirmation-dialog :show.sync="confirmationDialog">
            You are sure you want to delete your account?
            <template #confirm>
              <div class="d-flex justify-end">
                <v-btn
                  text
                  rounded
                  color="error"
                  :loading="deleteLoading"
                  @click="deleteAccount"
                >
                  Delete account
                </v-btn>
              </div>
              <v-snackbar v-model="snackbar" :color="color" absolute top>
                <b>
                  {{ message }}
                </b>
              </v-snackbar>
            </template>
          </confirmation-dialog>
        </v-container>
      </template>
    </data-viewer>
  </section>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import keycloak from "@/api/keycloak";
import InfoBlock from "../Base/InfoBlock/InfoBlock";
import ConfirmationDialog from "../Base/ConfirmationDialog";
import EntityField from "@/components/Entity/EntityFields/EntityField/EntityField";
import { useEntity } from "@/composables/entity";
import { useUser } from "@/composables/user";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { computed } from "@vue/composition-api/dist/vue-composition-api";
import EntityGeneral from "@/components/Entity/EntityCommonComponents/General/EntityGeneral";
import { useSnackbar } from "@/composables/snackbar";
import { ref } from "@vue/composition-api";

export default {
  name: "UserGeneral",
  components: {
    EntityGeneral,
    DataViewer,
    EntityField,
    ConfirmationDialog,
    InfoBlock,
    CustomHeader,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const confirmationDialog = ref(false);
    const { show, message, color, snackbar } = useSnackbar();
    const {
      load,
      loading,
      error,
      data,
      deleteEntity,
      deleteLoading,
      deleteError,
    } = useEntity(props.id);
    const { user, logout, isAdmin } = useUser();
    load();
    return {
      loading,
      confirmationDialog,
      error,
      data,
      user,
      deleteLoading,
      message,
      color,
      snackbar,
      isAdmin,
      keycloakAccountURL: computed(() => keycloak.kc.createAccountUrl()),
      deleteAccount: () =>
        deleteEntity().then(() => {
          if (deleteError.value) {
            show(deleteError.value, { color: "error" });
          } else {
            show("Account deleted", { color: "success" });
            logout().then(() => {
              confirmationDialog.value = false;
            });
          }
        }),
    };
  },
};
</script>

<style lang="scss"></style>
