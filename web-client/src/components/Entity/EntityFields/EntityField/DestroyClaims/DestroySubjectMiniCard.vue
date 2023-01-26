<template>
  <component :is="wrapperComponent" :id="entity.id" target="_self">
    <div
      class="entity-mini-card-container pa-3 full-width fill-height"
      :class="{ interactive: visible }"
    >
      <entity-avatar
        :entity-id="entity.id"
        :image-id="entity.entityIcon"
        :entity-title="entityTitle"
      />
      <div>
        <div class="d-flex justify-space-between align-center">
          <div v-if="entityTitle" style="flex: 1; width: 1px">
            <h2 class="entity-mini-card-title">
              <entity-details-link :id="entity.id">{{
                entityTitle
              }}</entity-details-link>
            </h2>
          </div>
          <span
            class="entity-mini-card-title-placeholder d-block pa-2 mt-2 full-width"
            v-else-if="!visible"
          ></span>
          <v-tooltip top open-delay="600" max-width="400px">
            <template #activator="{ on, attrs }">
              <v-icon
                v-show="!showDetails"
                @click="showDetails = !showDetails"
                color="primary"
                dense
                v-bind="attrs"
                v-on="on"
              >
                info_outline
              </v-icon>
              <v-icon
                v-show="showDetails"
                @click="showDetails = !showDetails"
                color="primary"
                dense
                v-bind="attrs"
                v-on="on"
              >
                info
              </v-icon>
            </template>
            <span>Click here to show or hide details (Experts Only)</span>
          </v-tooltip>
        </div>
        <div v-if="visible">
          <div class="mt-2">
            <v-chip
              class="mr-2"
              small
              label
              color="#EFF3F7FF"
              v-for="tag in entityTags"
              :key="tag"
            >
              {{ tag }}
            </v-chip>
          </div>
          <div v-if="showDetails">
            <v-alert
              v-show="destroySubject.id"
              color="warning"
              border="left"
              text
              dense
              class="mb-0 mt-2"
            >
              <span class="font-weight-bold">ID:</span>
              {{
                destroySubject.id.substr(
                  destroySubject.id.lastIndexOf(":") + 1,
                  destroySubject.id.length
                )
              }}
            </v-alert>
          </div>
          <div class="mt-4" v-if="destroySubject.destroyclaimConditions">
            <v-row>
              <v-col>
                <CodeEditor
                  :value="
                    JSON.stringify(
                      JSON.parse(destroySubject.destroyclaimConditions),
                      null,
                      3
                    )
                  "
                  :languages="[['json', 'Extension Conditions']]"
                  :read_only="true"
                  :copy_code="false"
                  :wrap_code="true"
                  font_size="12px"
                  width="auto"
                ></CodeEditor>
              </v-col>
            </v-row>
          </div>
          <div class="mt-8">
            <v-row>
              <v-col sm="4">
                <v-btn color="primary" class="gprimary" rounded block>
                  Destroy Action
                </v-btn>
              </v-col>
              <v-col sm="4">
                <entity-details-link :id="destroySubject.id" postfix="/details"
                  ><v-btn color="warning" rounded block>
                    Expert Conditions
                  </v-btn></entity-details-link
                >
              </v-col>
              <v-col sm="4">
                <v-btn
                  color="error"
                  rounded
                  block
                  @click="
                    () => removeFromDestroySubjects(destroySubject.edgeId, load)
                  "
                >
                  Remove
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
        <div v-else>
          <v-alert color="warning" text dense class="mb-0 mt-2">
            According to the system policies you have no rights to view this
            entity
          </v-alert>
        </div>
      </div>
    </div>
  </component>
</template>

<script>
import EntityAvatar from "@/components/Entity/EntityAvatar";
import CustomHeader from "@/components/Base/CustomHeader";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import EntityLikeButton from "@/components/Entity/EntityLikeButton";
import CodeEditor from "simple-code-editor";
import { useRequest } from "@/composables/request";
import { useApi, ref } from "@/composables/api";
import { useSnackbar } from "@/composables/snackbar";

export default {
  name: "DestroySubjectMiniCard",
  props: {
    entity: {
      type: Object,
      required: true,
    },
    destroySubject: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    load: {
      type: Function,
      required: true,
    },
  },
  components: {
    EntityLikeButton,
    EntityDetailsLink,
    CustomHeader,
    EntityAvatar,
    CodeEditor,
  },
  data: () => {
    return {
      showDetails: false,
    };
  },
  computed: {
    wrapperComponent() {
      return this.visible ? "div" : "div";
    },
    entityTitle() {
      return this.entity.title || this.entity.username;
    },
    entityTags() {
      return [
        this.entity.entityType,
        this.entity.resourceType,
        this.entity.assetType,
        this.entity.mimeType,
      ]
        .filter((t) => t)
        .map((t) => (t.length > 40 ? `${t.slice(0, 40)}...` : t));
    },
  },
  setup(props) {
    const { snackbar, message, color, show } = useSnackbar();
    const { request, loading, error } = useRequest();
    const { datanetwork } = useApi(props.id);
    const removeFromDestroySubjects = (edgeId, reloadListMethod) => {
      return request(datanetwork.deleteEdgeById(edgeId)).then(() => {
        const unacceptableError =
          error.value && error.value?.response?.status !== 404;
        if (unacceptableError) {
          show(error.value, { color: "error" });
        } else {
          reloadListMethod();
        }
      });
    };
    return {
      loading,
      error,
      snackbar,
      message,
      color,
      removeFromDestroySubjects,
    };
  },
};
</script>

<style scoped lang="scss">
.entity-mini-card-container {
  transition: 0.3s;
  border: 2px solid $bg_card_secondary;
  display: grid;
  grid-template-columns: 32px 1fr;
  grid-gap: 16px;
  @include border-radius;
  &.interactive {
    cursor: pointer;
    &:hover {
      /*background-color: $bg_card_secondary;*/
    }
  }
}
.entity-mini-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @include font-style(1.1rem, $font_header, normal, $font_primary_color);
}
.entity-mini-card-title-placeholder {
  @include border-radius-half;
  background-color: $bg_card_secondary;
}
</style>
