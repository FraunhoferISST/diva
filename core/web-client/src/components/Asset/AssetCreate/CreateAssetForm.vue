<template>
  <v-container class="pa-0" fluid>
    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-11 relative white">
        <v-container class="pa-0 fluid fill-height">
          <v-row>
            <v-col cols="12">
              <custom-header text="Specify a title for the new asset" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="title"
                label="Asset title"
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
                You will be redirected to a newly created asset
              </v-alert>
            </v-col>
          </v-row>
        </v-container>
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
      </v-col>
      <v-col cols="12" md="6">
        <v-container class="pa-0 fill-height" fluid>
          <colored-card
            :padding="false"
            :rounded="false"
            color="alternative"
            class="full-width fill-height"
          >
            <template slot="body">
              <div
                class="text-center action-container d-flex column wrap justify-center align-center"
              >
                <div class="action-content pa-2">
                  <custom-header
                    class="mb-3 hidden-sm-and-down"
                    text="Create new asset"
                  >
                  </custom-header>
                  <p class="hidden-sm-and-down">
                    Simply add the title and create new asset. You can add more
                    details later and connect your existing resources together
                  </p>
                  <div>
                    <v-btn
                      x-large
                      rounded
                      block
                      color="primary"
                      class="gsecondary"
                      :disabled="!title"
                      :loading="isLoading"
                      @click="createAsset"
                    >
                      Create asset
                    </v-btn>
                  </div>
                </div>
              </div>
            </template>
          </colored-card>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import ColoredCard from "@/components/Base/ColoredCard";
export default {
  name: "CreateAssetForm",
  components: {
    ColoredCard,
    CustomHeader,
  },
  data: () => ({
    title: "My new Asset",
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
    async createAsset() {
      this.isLoading = true;
      this.$api.assets
        .create({
          title: this.title,
          assetType: "generic",
          entities: [],
        })
        .then(({ data: id }) => {
          this.$router.push({
            name: "asset_details",
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

<style scoped lang="scss">
.action-container {
  position: relative;
  z-index: 2;
  height: 100%;
  min-height: 50vh;
  width: 100%;

  h1 {
    font-weight: 700;
    width: 100%;
    color: white;
    font-size: 2rem;
  }

  p {
    width: 100%;
    color: white;
    font-size: 1.2rem;
  }

  span {
    font-size: 2rem;
    color: white;
    font-weight: bold;
  }
}

.action-content {
  max-width: 450px;
  height: auto;
}

@media screen and (max-width: 959px) {
  .action-container {
    min-height: 0;
  }
}
</style>
