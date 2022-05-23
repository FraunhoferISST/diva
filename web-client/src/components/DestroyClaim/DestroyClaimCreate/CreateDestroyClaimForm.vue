<template>
  <create-form-container>
    <template>
      <v-container class="pa-0" fluid>
        <v-row>
          <v-col cols="12">
            <v-stepper v-model="e6" vertical non-linear>
              <v-stepper-step editable :complete="e6 > 1" step="1">
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

              <v-stepper-step editable :complete="e6 > 2" step="2">
                <custom-header text="WHY to destroy?" />
              </v-stepper-step>

              <v-stepper-content step="2">
                <v-alert icon="mdi-help-circle-outline" border="right">
                  For better verifiability, a reason for deletion should be
                  specified. Selecting a standardized reason for deletion
                  increases transparency. You can select several reasons. You
                  can also specify a customized reason.
                </v-alert>

                <v-treeview
                  v-model="tree"
                  :open="initiallyOpen"
                  :items="items"
                  activatable
                  item-key="name"
                  open-on-click
                >
                  <template v-slot:prepend="{ item }">
                    <v-icon v-if="item.icon">
                      {{ item.icon }}
                    </v-icon>
                    <v-icon v-else>
                      {{ files[item.file] }}
                    </v-icon>
                  </template>
                </v-treeview>
              </v-stepper-content>

              <v-stepper-step editable :complete="e6 > 3" step="3">
                <custom-header text="Specify WHO is responsible" />
              </v-stepper-step>
              <v-stepper-content step="3"> </v-stepper-content>

              <v-stepper-step editable step="4">
                <custom-header text="Specify WHERE to destroy" />
              </v-stepper-step>
              <v-stepper-content step="4"> </v-stepper-content>

              <v-stepper-step editable step="5">
                <custom-header text="Specify WHEN to destroy" />
              </v-stepper-step>
              <v-stepper-content step="5"> </v-stepper-content>

              <v-stepper-step editable step="6">
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
    initiallyOpen: ["public"],
    files: {
      html: "mdi-language-html5",
      js: "mdi-nodejs",
      json: "mdi-code-json",
      md: "mdi-language-markdown",
      pdf: "mdi-file-pdf",
      png: "mdi-file-image",
      txt: "mdi-file-document-outline",
      xls: "mdi-file-excel",
    },
    tree: [],
    items: [
      {
        name: "Data Quality Factors",
        icon: "mdi-quality-high",
        children: [
          { name: "Timeliness" },
          { name: "Uniqueness" },
          { name: "Accuracy" },
          { name: "Completeness" },
          { name: "Consistency" },
          { name: "Integrity" },
          { name: "Reasonability" },
          { name: "Validity" },
        ],
      },
      {
        name: "Human Factors",
        icon: "mdi-human-male-female-child",
      },
      {
        name: "Policy Factors",
        icon: "mdi-shield-check",
        children: [
          { name: "Rights-restriced Usage" },
          { name: "Role-restricted Usage" },
          { name: "Location-restriced Usage" },
          { name: "Duration-restriced Usage" },
          { name: "Number of uses exeeded" },
          { name: "Event-restricted Usage" },
          { name: "Interval-restricted Usage" },
          { name: "Purpose-restricted Usage" },
          { name: "Content-restricted Usage" },
        ],
      },
      {
        name: "Security Factors",
        icon: "mdi-lock",
        children: [
          {
            name: "Social Engineering",
            children: [{ name: "Spam" }, { name: "Fake News" }],
          },
          { name: "Virus" },
          { name: "Hardware" },
          { name: "Encryption" },
        ],
      },
      {
        name: "Technical Factors",
        icon: "mdi-coffee-maker",
        children: [
          { name: "Testdata" },
          { name: "Efficiency" },
          { name: "Technical Representation" },
          { name: "Corrupted Data" },
          { name: "Modification" },
        ],
      },
    ],
    /*
    items: [

      {
        action: "mdi-human-male-female-child",
        items: [
          { title: "Breakfast & brunch" },
          { title: "New American" },
          { title: "Sushi" },
        ],
        title: "Human Factors",
      },
      {
        action: "mdi-shield-check",
        items: [{ title: "List Item" }],
        title: "Policy Factors",
      },
      {
        action: "mdi-lock",
        items: [{ title: "List Item" }],
        title: "Security Factors",
      },
      {
        action: "mdi-coffee-maker",
        items: [{ title: "List Item" }],
        title: "Technical Factors",
      },
    ],*/
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
