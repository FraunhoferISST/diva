<template>
  <component :is="wrapperComponent" :id="destroyCondition.id" target="_self">
    <div
      class="entity-mini-card-container pa-3 full-width fill-height"
      :class="{ interactive: visible }"
    >
      <entity-avatar
        :entity-id="destroyCondition.id"
        :image-id="destroyCondition.entityIcon"
        :entity-title="entityTitle"
      />
      <div>
        <div class="d-flex justify-space-between align-center">
          <div v-if="entityTitle" style="flex: 1; width: 1px">
            <h2 class="entity-mini-card-title">
              <entity-details-link :id="destroyCondition.id">{{
                destroyCondition.title
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
                @click="showDetails = !showDetails"
                color="primary"
                dense
                v-bind="attrs"
                v-on="on"
              >
                info_outline
              </v-icon>
            </template>
            <span>Click here to show or hide details (Experts Only)</span>
          </v-tooltip>
        </div>
        <div v-if="visible" class="mt-2">
          <div>
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
          <div class="mt-4">
            <component
              v-bind:is="
                renderComponents.find(
                  (e) => e.name === destroyCondition.destroyclaimExtensionName
                ).viewerComponent
              "
              :value="destroyCondition.destroyclaimExtensionPayload"
            ></component>
          </div>
          <div v-if="showDetails">
            <v-alert
              v-show="destroyCondition.id"
              color="warning"
              border="left"
              text
              dense
              class="mb-0 mt-2"
            >
              <span class="font-weight-bold">ID:</span>
              {{
                destroyCondition.id.substr(
                  destroyCondition.id.lastIndexOf(":") + 1,
                  destroyCondition.id.length
                )
              }}
            </v-alert>
          </div>
          <div class="mt-4" v-if="showDetails">
            <CodeEditor
              :value="
                JSON.stringify(
                  destroyCondition.destroyclaimExtensionPayload,
                  null,
                  3
                )
              "
              :languages="[['json', 'Extension Payload']]"
              :read_only="true"
              :copy_code="false"
              :wrap_code="true"
              font_size="12px"
              width="auto"
            ></CodeEditor>
          </div>
          <div class="mt-4" v-if="destroyCondition.destroyclaimConditions">
            <v-row>
              <v-col>
                <CodeEditor
                  :value="
                    JSON.stringify(
                      JSON.parse(destroyCondition.destroyclaimConditions),
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
          <div class="mt-4">
            <v-row>
              <v-col sm="4" offset-sm="4">
                <entity-details-link
                  :id="destroyCondition.id"
                  postfix="/details"
                  ><v-btn color="primary" class="gprimary" rounded block>
                    Edit Conditions
                  </v-btn></entity-details-link
                >
              </v-col>
              <v-col sm="4">
                <v-btn
                  color="error"
                  rounded
                  block
                  @click="
                    () =>
                      removeFromDestroyConditions(destroyCondition.edgeId, load)
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
import { useRequest } from "@/composables/request";
import { useApi, reactive } from "@/composables/api";
import { useSnackbar } from "@/composables/snackbar";
import CodeEditor from "simple-code-editor";

export default {
  name: "DestroyConditionMiniCard",
  props: {
    destroyCondition: {
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
    renderComponents: {
      type: Array,
      required: true,
    },
  },
  data: () => {
    return {
      showDetails: false,
    };
  },
  components: {
    EntityLikeButton,
    EntityDetailsLink,
    CustomHeader,
    EntityAvatar,
    CodeEditor,
  },
  computed: {
    wrapperComponent() {
      return this.visible ? "div" : "div";
    },
    entityTitle() {
      return this.destroyCondition.title || this.destroyCondition.username;
    },
    entityTags() {
      return [
        this.destroyCondition.entityType,
        this.destroyCondition.destroyclaimType,
      ]
        .filter((t) => t)
        .map((t) => (t.length > 40 ? `${t.slice(0, 40)}...` : t));
    },
  },
  setup(props, context) {
    const { snackbar, message, color, show } = useSnackbar();
    const { request, loading, error } = useRequest();
    const { datanetwork } = useApi(props.id);

    const removeFromDestroyConditions = (edgeId, reloadListMethod) => {
      return request(datanetwork.deleteEdgeById(edgeId)).then(() => {
        const unacceptableError =
          error.value && error.value?.response?.status !== 404;
        if (unacceptableError) {
          show(error.value, { color: "error" });
        } else {
          reloadListMethod();
        }
        context.emit("update");
      });
    };
    return {
      loading,
      error,
      snackbar,
      message,
      color,
      removeFromDestroyConditions,
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
