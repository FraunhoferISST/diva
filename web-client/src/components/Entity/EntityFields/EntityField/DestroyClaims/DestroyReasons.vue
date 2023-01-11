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
          !addMode &&
          (!localDestroyclaimReasons || localDestroyclaimReasons.length === 0)
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
                <div class="destroyclaim-reason-add-form">
                  <destroy-reasons-edit
                    :destroyclaimReason.sync="newDestroyclaimReason"
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
                        @click="addDestroyclaimReason"
                        :disabled="!newDestroyclaimReason.value"
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
              Add new destroyclaim reason
              <v-icon small> add </v-icon>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
            v-for="(destroyclaimReason, i) in localDestroyclaimReasons"
            :key="`${destroyclaimReason.value}_${destroyclaimReason.name}_${i}`"
          >
            <field-editor
              :data="{ destroyclaimReason: { ...destroyclaimReason } }"
              :on-save="
                (editorPatch) => updateDestroyclaimReason(editorPatch, i)
              "
            >
              <template #view="{ state }">
                <div class="destroyclaim-reason-card pa-3">
                  <div
                    class="destroyclaim-reason-info d-flex"
                    v-if="state.destroyclaimReason.name"
                  >
                    <div class="ellipsis">
                      <info-block-value>
                        <h1 class="destroyclaim-reason-title mb-2 ellipsis">
                          {{ state.destroyclaimReason.name }}
                        </h1>
                      </info-block-value>
                    </div>
                  </div>
                  <div class="destroyclaim-reason-info d-flex">
                    <div>
                      <info-block-value>
                        {{ state.destroyclaimReason.value }}
                      </info-block-value>
                    </div>
                  </div>
                </div>
              </template>
              <template #edit="{ setPatch, patch, disableEdit }">
                <destroy-reasons-edit
                  :destroyclaimReason="patch.destroyclaimReason"
                  @update:destroyclaimReason="
                    setPatch({ destroyclaimReason: $event })
                  "
                  @remove="() => removeDestroyclaimReason(i, disableEdit)"
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
      localDestroyclaimReasons: this.destroyclaimDestroyReasons,
      newDestroyclaimReason: {
        value: "",
        name: "",
      },
      addMode: false,
    };
  },
  methods: {
    updateNewDestroyclaimReason({ reason }) {
      this.newDestroyclaimReason = reason;
    },
    updateDestroyclaimReason(patch, index) {
      const updatedTemporalDestroyclaimReasons = [
        ...this.localDestroyclaimReasons,
      ];
      updatedTemporalDestroyclaimReasons.splice(
        index,
        1,
        patch.destroyclaimReason
      );
      return this.patch({
        destroyclaimDestroyReasons: updatedTemporalDestroyclaimReasons,
      }).then(() => {
        if (this.patchError) {
          this.show(
            this.patchError?.response?.data?.message ?? this.patchError,
            { color: "error" }
          );
          return;
        }
        this.localDestroyclaimReasons = updatedTemporalDestroyclaimReasons;
      });
    },
    removeDestroyclaimReason(index, disableEdit) {
      const updatedTemporalDestroyclaimReasons = [
        ...this.localDestroyclaimReasons,
      ];
      updatedTemporalDestroyclaimReasons.splice(index, 1);
      return this.patch({
        destroyclaimDestroyReasons: updatedTemporalDestroyclaimReasons,
      }).then(() => {
        if (this.patchError) {
          this.show(
            this.patchError?.response?.data?.message ?? this.patchError,
            { color: "error" }
          );
          return;
        }
        disableEdit();
        this.localDestroyclaimReasons = updatedTemporalDestroyclaimReasons;
      });
    },
    addDestroyclaimReason() {
      const newTemporalDestroyclaimReasons = [
        this.newDestroyclaimReason,
        ...this.localDestroyclaimReasons,
      ];
      this.patch({
        destroyclaimDestroyReasons: newTemporalDestroyclaimReasons,
      }).then(() => {
        if (this.patchError) {
          this.show(
            this.patchError?.response?.data?.message ?? this.patchError,
            { color: "error" }
          );
          return;
        }
        this.localDestroyclaimReasons = newTemporalDestroyclaimReasons;
        this.addMode = false;
        this.newDestroyclaimReason = {
          value: "",
          name: "",
        };
      });
    },
  },
};
</script>
<style scoped lang="scss">
.destroyclaim-reason-add-card {
  min-height: 120px;
  border: 2px #5e94ff dashed;
  @include border-radius();
}
.destroyclaim-reason-add-form {
  background-color: $bg_card_secondary;
  @include border-radius-half();
}
.destroyclaim-reason-card {
  border: 2px solid $bg_card_secondary;
  @include border-radius();
}
.destroyclaim-reason-title {
  font-size: 1rem !important;
}
.destroyclaim-reason-info {
  gap: 15px;
}
.general-destroyclaim-reason {
  transition: 0.3s;
  color: $c_accent_primary;
  &:hover {
    color: $font_link_color_hover;
  }
}
</style>
