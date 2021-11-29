<template>
  <no-data-state
    v-if="!addMode && (!localLicenses || localLicenses.length === 0)"
  >
    <div>
      No licenses specified <br />
      <v-btn
        rounded
        text
        small
        class="mt-2"
        color="#2d68fc"
        @click="addMode = true"
      >
        Add first license
        <v-icon small> add </v-icon>
      </v-btn>
    </div>
  </no-data-state>
  <v-row v-else>
    <v-col cols="12" class="pb-0">
      <v-row v-if="addMode" class="mb-1">
        <v-col cols="12" sm="12" md="6" lg="4" xl="4">
          <div class="license-add-form">
            <general-license-edit
              :license.sync="newLicense"
              @update:license="test"
            >
              <template>
                <v-btn
                  rounded
                  small
                  text
                  color="default"
                  :disabled="loading"
                  @click="addMode = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  class="ml-2"
                  rounded
                  small
                  depressed
                  color="primary"
                  @click="addLicense"
                  :disabled="!newLicense.url"
                  :loading="loading"
                >
                  Add license
                </v-btn>
              </template>
            </general-license-edit>
          </div>
        </v-col>
      </v-row>
      <v-btn
        v-else
        rounded
        depressed
        text
        small
        color="#2d68fc"
        @click="addMode = true"
      >
        Add new license
        <v-icon small> add </v-icon>
      </v-btn>
    </v-col>
    <v-col
      cols="12"
      sm="12"
      md="6"
      lg="4"
      xl="4"
      v-for="(license, i) in localLicenses"
      :key="`${license.url}_${license.code}_${license.name}_${license.attributedByText}_${i}`"
    >
      <edit-view-content
        :initial-data="{ license: { ...license } }"
        :on-save="(patch) => updateLicense(patch, i)"
      >
        <template #view>
          <div class="license-card pa-3">
            <div class="license-info d-flex" v-if="license.name">
              <div class="ellipsis">
                <info-block-value>
                  <h1 class="license-title mb-2 ellipsis">
                    {{ license.name }}
                  </h1>
                </info-block-value>
              </div>
            </div>
            <div class="license-info d-flex">
              <info-block-value>URL:</info-block-value>
              <div class="ellipsis">
                <info-block-value>
                  <a
                    class="general-license"
                    :href="license.url"
                    target="_blank"
                    @click.stop="() => {}"
                  >
                    {{ license.url }}
                  </a>
                </info-block-value>
              </div>
            </div>
            <div class="license-info d-flex">
              <info-block-value>License code:</info-block-value>
              <info-block-value>
                {{ license.code || "-" }}
              </info-block-value>
            </div>
            <div class="license-info d-flex">
              <info-block-value>Attributed by:</info-block-value>
              <div class="ellipsis">
                <info-block-value>
                  {{ license.attributedByText || "-" }}
                </info-block-value>
              </div>
            </div>
          </div>
        </template>
        <template #edit="{ setEditedData, state, disableEdit }">
          <general-license-edit
            :license="state.license"
            @update:license="setEditedData({ license: $event })"
            @remove="() => removeLicense(i, disableEdit)"
          />
        </template>
      </edit-view-content>
    </v-col>
  </v-row>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import GeneralLicenseEdit from "@/components/Entity/EntityCommonComponents/General/GeneralLicenses/GeneralLicenseEdit";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import EditViewContent from "@/components/Containers/EditViewContent";
export default {
  name: "GeneralLicenses",
  components: {
    EditViewContent,
    InfoBlockValue,
    GeneralLicenseEdit,
    NoDataState,
  },
  props: {
    licenses: {
      type: Array,
      required: true,
    },
    saveMethod: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      localLicenses: this.licenses,
      newLicense: {
        url: "",
        name: "",
        code: "",
        attributedByText: "",
      },
      addMode: false,
    };
  },
  methods: {
    test(d) {
      console.log(d);
    },
    updateNewLicense({ license }) {
      this.newLicense = license;
    },
    updateLicense(patch, index) {
      const updatedTemporalLicenses = [...this.localLicenses];
      updatedTemporalLicenses.splice(index, 1, patch.license);
      return this.saveMethod({ licenses: updatedTemporalLicenses }).then(
        () => (this.localLicenses = updatedTemporalLicenses)
      );
    },
    removeLicense(index, disableEdit) {
      const updatedTemporalLicenses = [...this.localLicenses];
      updatedTemporalLicenses.splice(index, 1);
      return this.saveMethod({ licenses: updatedTemporalLicenses }).then(() => {
        disableEdit();
        this.localLicenses = updatedTemporalLicenses;
      });
    },
    addLicense() {
      this.loading = true;
      const newTemporalLicenses = [this.newLicense, ...this.localLicenses];
      this.saveMethod({ licenses: newTemporalLicenses })
        .then(() => {
          this.localLicenses = newTemporalLicenses;
          this.loading = false;
          this.addMode = false;
          this.newLicense = {
            url: "",
            name: "",
            code: "",
            attributedByText: "",
          };
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.license-add-card {
  min-height: 120px;
  border: 2px #5e94ff dashed;
  @include border-radius();
}
.license-add-form {
  background-color: $bg_card_secondary;
  @include border-radius-half();
}
.license-card {
  border: 2px solid $bg_card_secondary;
  @include border-radius();
}
.license-title {
  font-size: 1rem !important;
}
.license-info {
  gap: 15px;
}
.general-license {
  transition: 0.3s;
  color: $c_accent_primary;
  &:hover {
    color: $font_link_color_hover;
  }
}
</style>
