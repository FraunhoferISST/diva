<template>
  <create-form-container>
    <template>
      <v-container class="pa-0" fluid>
        <v-row>
          <v-col cols="12">
            <custom-header text="Specify a title for the new service" />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="title"
              label="Service title"
              outlined
              dense
              rounded
              hide-details
              autofocus
              background-color="transparent"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-alert text dense type="info">
              You will be redirected to a newly created service
            </v-alert>
          </v-col>
        </v-row>
        <v-snackbar
          rounded
          text
          v-model="snackbar"
          :timeout="10000"
          absolute
          color="error"
        >
          <p class="mb-2">
            <b>Something went wrong! Please check the data and try again</b>
          </p>
          <v-divider class="mb-2"></v-divider>
          <span>
            <b>{{ snackbarMsg }}</b>
          </span>
        </v-snackbar>
      </v-container>
    </template>
    <template #title>
      <custom-header
        style="color: white; font-size: 2rem !important"
        text="Create new service"
      >
      </custom-header>
    </template>
    <template #hint>
      <span>
        Simply add a title and create a new service. You can add more details
        later.
      </span>
    </template>
    <template #import-button>
      <v-btn
        x-large
        rounded
        block
        color="primary"
        class="gsecondary"
        :disabled="!title"
        :loading="isLoading"
        type="submit"
        @click.prevent="createService"
      >
        Create Service
      </v-btn>
    </template>
  </create-form-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import CreateFormContainer from "@/components/Create/CreateFormContainer";
export default {
  name: "CreateServiceForm",
  components: {
    CreateFormContainer,
    CustomHeader,
  },
  data: () => ({
    title: "My new Service",
    snackbar: false,
    snackbarMsg: "",
    isLoading: false,
  }),
  computed: {
    isReady() {
      return !!(this.selectedSource && this.selectedSource.isReady);
    },
    isSmAndDown() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    async createService() {
      this.isLoading = true;
      this.$api.services
        .create({
          title: this.title,
          serviceType: "generic",
          isActive: false,
        })
        .then(({ data: id }) => {
          this.$router.push({
            name: "entities",
            params: { id },
          });
        })
        .catch((e) => this.showSnackbar(e?.response?.data?.message))
        .finally(() => (this.isLoading = false));
    },
    showSnackbar(msg) {
      this.snackbarMsg = msg;
      this.snackbar = true;
    },
  },
};
</script>

<style scoped lang="scss"></style>
