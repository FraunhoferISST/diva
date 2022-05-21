<template>
  <create-form-container>
    <template>
      <v-container class="pa-0" fluid>
        <v-row>
          <v-col cols="12">
            <v-stepper v-model="e6" vertical>
              <v-stepper-step :complete="e6 > 1" step="1">
                <custom-header text="Specify WHAT to destroy" />
              </v-stepper-step>

              <v-stepper-content step="1">
                <v-card
                  color="grey lighten-1"
                  class="mb-12"
                  height="200px"
                ></v-card>
                <v-btn color="primary" @click="e6 = 2"> Continue </v-btn>
                <v-btn text> Cancel </v-btn>
              </v-stepper-content>

              <v-stepper-step :complete="e6 > 2" step="2">
                <custom-header text="Specify WHY to destroy" />
              </v-stepper-step>

              <v-stepper-content step="2"> </v-stepper-content>

              <v-stepper-step :complete="e6 > 3" step="3">
                <custom-header text="Specify WHO is responsible" />
              </v-stepper-step>
              <v-stepper-content step="3"> </v-stepper-content>

              <v-stepper-step step="4">
                <custom-header text="Specify WHERE to destroy" />
              </v-stepper-step>
              <v-stepper-content step="4"> </v-stepper-content>

              <v-stepper-step step="5">
                <custom-header text="Specify WHEN to destroy" />
              </v-stepper-step>
              <v-stepper-content step="5"> </v-stepper-content>

              <v-stepper-step step="6">
                <custom-header text="Specify HOW to destroy" />
              </v-stepper-step>
              <v-stepper-content step="6"> </v-stepper-content>
            </v-stepper>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template #title>
      <custom-header
        style="color: white; font-size: 2rem !important"
        text="Create new Destroy Claim"
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
        Create Destroy Claim
      </v-btn>
    </template>
  </create-form-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import CreateFormContainer from "@/components/Create/CreateFormContainer";
export default {
  name: "CreateDestroyClaimForm",
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
          entities: [],
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
