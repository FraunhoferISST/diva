<template>
  <info-block :title="fieldSchema.title">
    <template #title v-if="fieldSchema.description">
      <info-block-title class="d-flex justify-space-between">
        {{ fieldSchema.title }}
        <template #info>
          <v-tooltip top open-delay="600" max-width="400px">
            <template #activator="{ on, attrs }">
              <v-icon color="primary" dense v-bind="attrs" v-on="on">
                info_outline
              </v-icon>
            </template>
            <span>{{ fieldSchema.description }}</span>
          </v-tooltip>
        </template>
      </info-block-title>
    </template>
    <template #value>
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
      <v-container v-else fluid class="pa-0">
        <v-row>
          <v-col cols="12" class="pb-0">
            <v-row v-if="addMode" class="mb-1 relative">
              <v-col cols="12" sm="12" md="6" lg="4" xl="4">
                <div class="license-add-form">
                  <license-edit :license.sync="newLicense">
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
                  </license-edit>
                </div>
              </v-col>
              <v-snackbar
                absolute
                top
                text
                v-model="snackbar"
                :color="color"
                :timeout="6000"
              >
                {{ message }}
              </v-snackbar>
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
            <field-editor
              :data="{ license: { ...license } }"
              :on-save="(editorPatch) => updateLicense(editorPatch, i)"
            >
              <template #view="{ state }">
                <div class="license-card pa-3">
                  <div class="license-info d-flex" v-if="state.license.name">
                    <div class="ellipsis">
                      <info-block-value>
                        <h1 class="license-title mb-2 ellipsis">
                          {{ state.license.name }}
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
                          :href="state.license.url"
                          target="_blank"
                          @click.stop="() => {}"
                        >
                          {{ state.license.url }}
                        </a>
                      </info-block-value>
                    </div>
                  </div>
                  <div class="license-info d-flex">
                    <info-block-value>License code:</info-block-value>
                    <info-block-value>
                      {{ state.license.code || "-" }}
                    </info-block-value>
                  </div>
                  <div class="license-info d-flex">
                    <info-block-value>Attributed by:</info-block-value>
                    <div class="ellipsis">
                      <info-block-value>
                        {{ state.license.attributedByText || "-" }}
                      </info-block-value>
                    </div>
                  </div>
                </div>
              </template>
              <template #edit="{ setPatch, patch, disableEdit }">
                <license-edit
                  :license="patch.license"
                  @update:license="setPatch({ license: $event })"
                  @remove="() => removeLicense(i, disableEdit)"
                />
                <v-snackbar
                  absolute
                  top
                  text
                  v-model="snackbar"
                  :color="color"
                  :timeout="0"
                >
                  {{ message }}
                </v-snackbar>
              </template>
            </field-editor>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </info-block>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
import { useEntity } from "@/composables/entity";
import { useSnackbar } from "@/composables/snackbar";
import LicenseEdit from "@/components/Entity/EntityFields/EntityField/Licenses/LicenseEdit";

export default {
  name: "Licenses",
  inheritAttrs: false,
  components: {
    LicenseEdit,
    FieldEditor,
    InfoBlock,
    InfoBlockValue,
    InfoBlockTitle,
    NoDataState,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    licenses: {
      type: Array,
      required: true,
    },
    editable: {
      type: Boolean,
      required: true,
    },
    fieldSchema: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { show, snackbar, message, color } = useSnackbar();
    const { loading, patch, error, patchError } = useEntity(props.id, {
      reactive: false,
    });
    return {
      loading,
      patch,
      error,
      show,
      snackbar,
      color,
      message,
      patchError,
    };
  },
  data() {
    return {
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
    updateNewLicense({ license }) {
      this.newLicense = license;
    },
    updateLicense(patch, index) {
      const updatedTemporalLicenses = [...this.localLicenses];
      updatedTemporalLicenses.splice(index, 1, patch.license);
      return this.patch({ licenses: updatedTemporalLicenses }).then(() => {
        if (this.patchError) {
          this.show(
            this.patchError?.response?.data?.message ?? this.patchError,
            { color: "error" }
          );
          return;
        }
        this.localLicenses = updatedTemporalLicenses;
      });
    },
    removeLicense(index, disableEdit) {
      const updatedTemporalLicenses = [...this.localLicenses];
      updatedTemporalLicenses.splice(index, 1);
      return this.patch({ licenses: updatedTemporalLicenses }).then(() => {
        if (this.patchError) {
          this.show(
            this.patchError?.response?.data?.message ?? this.patchError,
            { color: "error" }
          );
          return;
        }
        disableEdit();
        this.localLicenses = updatedTemporalLicenses;
      });
    },
    addLicense() {
      const newTemporalLicenses = [this.newLicense, ...this.localLicenses];
      this.patch({ licenses: newTemporalLicenses }).then(() => {
        if (this.patchError) {
          this.show(
            this.patchError?.response?.data?.message ?? this.patchError,
            { color: "error" }
          );
          return;
        }
        this.localLicenses = newTemporalLicenses;
        this.addMode = false;
        this.newLicense = {
          url: "",
          name: "",
          code: "",
          attributedByText: "",
        };
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
