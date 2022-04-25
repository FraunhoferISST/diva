<template>
  <section id="user-general">
    <data-viewer :loading="loading" :error="error">
      <template v-if="data">
        <v-container class="pa-0 ma-0" fluid>
          <v-row>
            <v-col
              cols="12"
              :sm="attribute.fullWith ? '12' : '6'"
              md="4"
              v-for="attribute in fields"
              :key="attribute.name"
            >
              <entity-field
                :id="id"
                :property="attribute.name"
                :title="attribute.title"
                :type="attribute.type"
                :value.sync="attribute.value"
                mutate-source
              />
            </v-col>
          </v-row>
          <v-row class="pt-5">
            <v-col cols="12">
              <custom-header text="Account information" />
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" md="6">
                      <info-block title="Email" :value="data.email">
                      </info-block>
                    </v-col>
                    <v-col cols="12" md="6">
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
                <v-col cols="12">
                  <entity-field
                    :id="id"
                    property="username"
                    title="Username"
                    :value.sync="data.username"
                    type="text"
                    mutate-source
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-alert text color="error" class="my-4">
                You can delete your DIVA account. Please note that the data
                cannot be restored. Your data in Keycloak will not be affected
                by deleting your DIVA account.
                <div class="d-flex justify-end">
                  <v-btn
                    class="mt-3"
                    text
                    rounded
                    color="error"
                    @click="showConfirmationDialog"
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
                  :loading="isLoading"
                  @click="deleteAccount"
                >
                  Delete account
                </v-btn>
              </div>
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
import DataViewer from "@/components/DataFetchers/DataViewer";
import { computed } from "@vue/composition-api/dist/vue-composition-api";

export default {
  name: "UserGeneral",
  components: {
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
    const { load, loading, error, data, schema } = useEntity(props.id);
    load();
    return {
      load,
      loading,
      error,
      data,
      fields: computed(() =>
        Object.entries(schema.value ?? {})
          .map(([k, v]) => ({ ...v, propertyName: k }))
          .filter((prop) => prop._ui && prop._ui.view === "overview")
          .map((prop) => ({
            ...prop,
            ...prop._ui,
            value:
              data.value[prop.propertyName] ??
              prop.default ??
              prop._ui.fallbackValue,
          }))
          .sort((a, b) => a.position - b.position)
      ),
    };
  },
  data() {
    return {
      confirmationDialog: false,
      snackbar: false,
      snackbarMsg: "",
      snackbarColor: "",
      isLoading: false,
    };
  },
  computed: {
    contactInformation() {
      return [
        {
          name: "phoneNumber",
          type: "text",
          title: "Phone number",
          fullWith: false,
        },
        {
          name: "mobileNumber",
          type: "text",
          title: "Mobile number",
          fullWith: false,
        },
        {
          name: "addressLocality",
          type: "text",
          title: "Address locality",
          fullWith: false,
        },
        {
          name: "addressRegion",
          type: "text",
          title: "Address region",
          fullWith: false,
        },
        {
          name: "postalCode",
          type: "number",
          title: "Postal Code",
          fullWith: false,
        },
        {
          name: "streetAddress",
          type: "text",
          title: "Street address",
          fullWith: false,
        },
        {
          name: "postOfficeBoxNumber",
          type: "number",
          title: "Post office box number",
          fullWith: false,
        },
        {
          name: "company",
          type: "text",
          title: "Company",
          fullWith: false,
        },
        {
          name: "jobTitle",
          type: "text",
          title: "Job title",
          fullWith: false,
        },
      ].map((attr) => ({
        ...attr,
        value: this.data[attr.name],
        readonly: !this.canEdit,
      }));
    },
    canEdit() {
      return this.loggedInUserId === this.data?.id;
    },
    loggedInUserId() {
      return this.$store.state.user.id;
    },
    keycloakAccountURL() {
      return keycloak.kc.createAccountUrl();
    },
  },
  methods: {
    deleteAccount() {
      this.isLoading = true;
      this.$api.users
        .delete(this.userData.id)
        .then(() => {
          this.logout();
          this.confirmationDialog = false;
        })
        .catch((e) => {
          this.showSnackbar(e?.response?.data?.message || e.message, "error");
        })
        .finally(() => (this.isLoading = false));
    },
    logout() {
      return this.$store.dispatch("logout").then(() => {
        keycloak.logout({
          redirectUri: `${window.location.origin}`,
        });
      });
    },
    showConfirmationDialog() {
      this.confirmationDialog = true;
    },
    showSnackbar(msg, color = "success") {
      this.snackbar = true;
      this.snackbarMsg = msg;
      this.snackbarColor = color;
    },
  },
};
</script>

<style lang="scss"></style>
