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
        v-if="
          !addMode && (!localDestroyReasons || localDestroyReasons.length === 0)
        "
      >
        <div>
          No Destroy Reason specified <br />
          <v-btn
            rounded
            text
            small
            class="mt-2"
            color="#2d68fc"
            @click="addMode = true"
          >
            Add first Destroy Reason
            <v-icon small> add </v-icon>
          </v-btn>
        </div>
      </no-data-state>
      <v-container v-else fluid class="pa-0">
        <v-row>
          <v-col cols="12" class="pb-0">
            <v-row v-if="addMode" class="mb-1 relative">
              <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                <div class="destroy-reason-add-form">
                  <destroy-reasons-edit :destroyReason.sync="newDestroyReason">
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
                        @click="addDestroyReason"
                        :disabled="!newDestroyReason.value"
                        :loading="loading"
                      >
                        Add Destroy Reason
                      </v-btn>
                    </template>
                  </destroy-reasons-edit>
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
              Add new destroy reason
              <v-icon small> add </v-icon>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
            v-for="(destroyReason, i) in localDestroyReasons"
            :key="`${destroyReason.value}_${destroyReason.name}_${i}`"
          >
            <field-editor
              :data="{ destroyReason: { ...destroyReason } }"
              :on-save="(editorPatch) => updateDestroyReason(editorPatch, i)"
            >
              <template #view="{ state }">
                <div class="destroy-reason-card pa-3">
                  <div
                    class="destroy-reason-info d-flex"
                    v-if="state.destroyReason.name"
                  >
                    <div class="ellipsis">
                      <info-block-value>
                        <h1 class="destroy-reason-title mb-2 ellipsis">
                          {{ state.destroyReason.name }}
                        </h1>
                      </info-block-value>
                    </div>
                  </div>
                  <div class="destroy-reason-info d-flex">
                    <div>
                      <info-block-value>
                        {{ state.destroyReason.value }}
                      </info-block-value>
                    </div>
                  </div>
                </div>
              </template>
              <template #edit="{ setPatch, patch, disableEdit }">
                <destroy-reasons-edit
                  :destroyReason="patch.destroyReason"
                  @update:destroyReason="setPatch({ destroyReason: $event })"
                  @remove="() => removeDestroyReason(i, disableEdit)"
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
import DestroyReasonsEdit from "@/components/Entity/EntityFields/EntityField/DestroyClaims/DestroyReasonsEdit";
export default {
  name: "DestroyReasons",
  inheritAttrs: false,
  components: {
    DestroyReasonsEdit,
    FieldEditor,
    InfoBlock,
    InfoBlockTitle,
    InfoBlockValue,
    NoDataState,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    destroyclaimDestroyReasons: {
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
      localDestroyReasons: this.destroyclaimDestroyReasons,
      newDestroyReason: {
        value: "",
        name: "",
      },
      addMode: false,
    };
  },
  methods: {
    updateNewDestroyReason({ reason }) {
      this.newDestroyReason = reason;
    },
    updateDestroyReason(patch, index) {
      const updatedTemporalDestroyReasons = [...this.localDestroyReasons];
      updatedTemporalDestroyReasons.splice(index, 1, patch.destroyReason);
      return this.patch({
        destroyclaimDestroyReasons: updatedTemporalDestroyReasons,
      }).then(() => {
        if (this.patchError) {
          this.show(
            this.patchError?.response?.data?.message ?? this.patchError,
            { color: "error" }
          );
          return;
        }
        this.localDestroyReasons = updatedTemporalDestroyReasons;
      });
    },
    removeDestroyReason(index, disableEdit) {
      const updatedTemporalDestroyReasons = [...this.localDestroyReasons];
      updatedTemporalDestroyReasons.splice(index, 1);
      return this.patch({
        destroyclaimDestroyReasons: updatedTemporalDestroyReasons,
      }).then(() => {
        if (this.patchError) {
          this.show(
            this.patchError?.response?.data?.message ?? this.patchError,
            { color: "error" }
          );
          return;
        }
        disableEdit();
        this.localDestroyReasons = updatedTemporalDestroyReasons;
      });
    },
    addDestroyReason() {
      const newTemporalDestroyReasons = [
        this.newDestroyReason,
        ...this.localDestroyReasons,
      ];
      this.patch({
        destroyclaimDestroyReasons: newTemporalDestroyReasons,
      }).then(() => {
        if (this.patchError) {
          this.show(
            this.patchError?.response?.data?.message ?? this.patchError,
            { color: "error" }
          );
          return;
        }
        this.localDestroyReasons = newTemporalDestroyReasons;
        this.addMode = false;
        this.newDestroyReason = {
          value: "",
          name: "",
        };
      });
    },
  },
};
</script>
<style scoped lang="scss">
.destroy-reason-add-card {
  min-height: 120px;
  border: 2px #5e94ff dashed;
  @include border-radius();
}
.destroy-reason-add-form {
  background-color: $bg_card_secondary;
  @include border-radius-half();
}
.destroy-reason-card {
  border: 2px solid $bg_card_secondary;
  @include border-radius();
}
.destroy-reason-title {
  font-size: 1rem !important;
}
.destroy-reason-info {
  gap: 15px;
}
.general-destroy-reason {
  transition: 0.3s;
  color: $c_accent_primary;
  &:hover {
    color: $font_link_color_hover;
  }
}
</style>
