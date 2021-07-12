<template>
  <section id="asset-create">
    <v-container class="fill-height" fluid>
      <v-row no-gutters class="mb-5 pb-5" align="center">
        <v-col
          cols="12"
          sm="12"
          md="12"
          lg="8"
          xl="8"
          offset="0"
          offset-sm="0"
          offset-md="0"
          offset-lg="2"
        >
          <card :padding="false">
            <template slot="body">
              <form id="asset-create-form" @submit.prevent="dialog = true">
                <v-row align="center">
                  <v-col cols="12" sm="12" md="6">
                    <card>
                      <v-row class="px-5" slot="body">
                        <v-col cols="12">
                          <h1
                            class="text-center mb-4"
                            style="font-size: 1.8rem"
                          >
                            Create new asset
                          </h1>
                          <div>
                            <v-text-field
                              class="glow"
                              color="blue"
                              hide-details
                              label="Asset title"
                              v-model="title"
                              rounded
                              autofocus
                              type="text"
                              clearable
                              filled
                            >
                            </v-text-field>
                          </div>
                        </v-col>
                        <v-col class="px-5 mt-2" cols="12">
                          <v-btn
                            type="submit"
                            block
                            class="ma-0 gprimary"
                            rounded
                            :disabled="!title"
                            color="primary"
                            :loading="loading"
                            @click="createAsset"
                          >
                            create
                          </v-btn>
                        </v-col>
                      </v-row>
                    </card>
                  </v-col>
                  <v-col class="py-0" cols="12" md="6">
                    <create-form-action-card
                      :hint="hint"
                      image="create/select_asset_img.svg"
                      color="alternative"
                    >
                    </create-form-action-card>
                  </v-col>
                </v-row>
              </form>
            </template>
          </card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script>
import Card from "@/components/Base/Card";
import CreateFormActionCard from "@/components/Create/CreateFormActionCard";

export default {
  name: "AssetCreate",
  components: {
    CreateFormActionCard,
    Card,
  },
  data: () => ({
    title: "My new Asset",
    id: "",
    dialog: false,
    description: "",
    desc: "",
    loading: false,
    hint: `Simply add the title and create new asset. You can add more details later and connect your existing
      resources together`,
  }),
  methods: {
    async createAsset() {
      this.loading = true;
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
        .catch((e) => {
          console.error(e);
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped lang="scss">
#asset-create {
  height: 100%;
}

.asset-create-hint {
  color: $font_secondary_color;
  font-weight: bold;
}

.asset-create-save-btn {
  width: 100%;
  position: relative;
  bottom: -20px;
}

.create-asset-selected-items {
  outline: 2px dashed rgba(146, 176, 179, 0.2);
  outline-offset: -10px;
  outline-radius: 10px;
  @include border-radius-half;
  @include gradient-primary(0.1, 0.1);
}
</style>
