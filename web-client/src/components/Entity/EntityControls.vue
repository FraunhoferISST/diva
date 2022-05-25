<template>
  <v-navigation-drawer
    v-model="computedShow"
    color="white"
    right
    fixed
    floating
    temporary
    width="700px"
    class="entity-controls-card"
  >
    <card :padding="false">
      <v-container fluid class="pa-0">
        <div class="pa-3">
          <v-btn icon @click="computedShow = false">
            <v-icon color="error" small> close </v-icon>
          </v-btn>
        </div>
        <v-row>
          <v-col cols="12">
            <v-list subheader two-line three-line flat class="px-md-10">
              <v-subheader>Visibility</v-subheader>
              <v-list-item v-for="(item, i) in visibilitySettings" :key="i">
                <template>
                  <v-list-item-action>
                    <v-switch
                      dense
                      inset
                      hide-details
                      v-model="item.value"
                      color="primary"
                      :loading="patchLoading"
                      @change="(value) => patchVisibility(item, i, value)"
                    />
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title> {{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list>
            <v-divider v-if="isAdmin"></v-divider>
            <v-list two-line subheader v-if="isAdmin" class="pb-0">
              <v-list-item
                @click="showFieldCreationDialog"
                class="py-2 px-md-10"
              >
                <v-list-item-icon>
                  <v-icon color="primary">add</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Add field</v-list-item-title>
                  <v-list-item-subtitle>
                    Change the data model
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider v-if="!isAdmin"></v-divider>
            <v-list two-line subheader color="red lighten-5" class="pb-0">
              <v-list-item
                @click="showConfirmationDialog"
                class="py-2 px-md-10"
              >
                <v-list-item-icon color="primary">
                  <v-icon color="error">delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Delete entity</v-list-item-title>
                  <v-list-item-subtitle>
                    Remove the entity and all corresponding data from the system
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        <confirmation-dialog :show.sync="confirmationDialog">
          <v-alert text color="error">
            Are you sure you want to delete this entity? All corresponding data
            will be removed and can no longer be restored!
          </v-alert>
          <template #confirm>
            <v-btn text rounded color="error" @click="deleteEnt">
              Delete entity
            </v-btn>
            <v-snackbar text color="error" v-model="snackbar" absolute>
              {{ message }}
            </v-snackbar>
          </template>
        </confirmation-dialog>
        <entity-field-creation-dialog
          :show.sync="fieldCreationDialog"
          :scope="schemaScope"
        />
        <v-snackbar absolute top :color="color" v-model="snackbar">
          <b>{{ message }}</b>
        </v-snackbar>
      </v-container>
    </card>
  </v-navigation-drawer>
</template>

<script>
import Card from "@/components/Base/Card";
import ConfirmationDialog from "@/components/Base/ConfirmationDialog";
import EntityFieldCreationDialog from "@/components/Entity/EntityFieldCreationDialog";
import { computed, ref } from "@vue/composition-api/dist/vue-composition-api";
import { useUser } from "@/composables/user";
import { useSnackbar } from "@/composables/snackbar";
import { useEntity } from "@/composables/entity";
export default {
  name: "EntityControls",
  components: {
    EntityFieldCreationDialog,
    ConfirmationDialog,
    Card,
  },
  props: {
    entity: {
      type: Object,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit, root }) {
    const confirmationDialog = ref(false);
    const fieldCreationDialog = ref(false);
    const showControls = ref(false);

    const computedShow = computed({
      get: () => props.show,
      set: (val) => emit("update:show", val),
    });

    const visibilitySettings = computed(() => [
      {
        title: "Private",
        description: `Access to the private entities is restricted through the policies and is probably allowed only for the creators, owners and admins`,
        value: !!props.entity.isPrivate,
        property: "isPrivate",
      },
      {
        title: "Archived",
        description: "Mark the the entity as archived",
        value: !!props.entity.isArchived,
        property: "isArchived",
      },
    ]);

    const { isAdmin } = useUser();
    const {
      color,
      show: showSnackbar,
      message,
      snackbar,
      timeout,
    } = useSnackbar();
    const {
      patch,
      patchLoading,
      patchError,
      deleteEntity,
      deleteLoading,
      deleteError,
    } = useEntity(props.entity.id);
    return {
      showControls,
      confirmationDialog,
      fieldCreationDialog,
      color,
      timeout,
      message,
      snackbar,
      deleteError,
      deleteLoading,
      isAdmin,
      computedShow,
      patchLoading,
      patchError,
      schemaScope: computed(() => [
        !props.entity
          ? []
          : Object.entries({
              mimeType: props.entity.mimeType,
              resourceType: props.entity.resourceType,
              systemEntityType: props.entity.systemEntityType,
              assetType: props.entity.assetType,
              entityType: props.entity.entityType,
            })
              .map(([key, value]) => ({ key: key, value: value }))
              .filter(({ value }) => value)[0],
      ]),
      showSnackbar,
      visibilitySettings,
      patchVisibility: (item, position, val) => {
        return patch({
          [item.property]: val,
        }).then(() => {
          if (patchError.value) {
            visibilitySettings.value = visibilitySettings.value[
              position
            ].value = !val;
            showSnackbar(patchError.value, { color: "error" });
          }
        });
      },
      deleteEnt: () =>
        deleteEntity().then(() => {
          if (deleteError.value) {
            showSnackbar(deleteError.value, { color: "error" });
          } else {
            showSnackbar("Entity deleted", { color: "success" });
            confirmationDialog.value = false;
            setTimeout(() => root.$router.push({ name: "search" }), 1000);
          }
        }),
      showConfirmationDialog: () => (confirmationDialog.value = true),
      showFieldCreationDialog: () => {
        fieldCreationDialog.value = true;
        computedShow.value = false;
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.entity-controls-card {
  padding-bottom: 70px;
  box-shadow: 0 0.7px 2.2px rgba(0, 0, 0, 0.011),
    0 1.7px 5.3px rgba(0, 0, 0, 0.016), 0 3.1px 10px rgba(0, 0, 0, 0.02),
    0 5.6px 17.9px rgba(0, 0, 0, 0.024), 0 10.4px 33.4px rgba(0, 0, 0, 0.029),
    0 25px 80px rgba(0, 0, 0, 0.04);
}
</style>
