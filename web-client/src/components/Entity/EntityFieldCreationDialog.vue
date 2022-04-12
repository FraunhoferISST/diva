<template>
  <v-dialog v-model="computedShow" max-width="1200" scrollable>
    <card>
      <template>
        <div class="pa-4" style="overflow-y: auto; height: 75vh">
          <field-creator :scope="scope" @edit="onEdit" />
        </div>
        <div class="create-controls d-flex justify-end pb-4 pt-10">
          <v-btn color="primary" text rounded @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn
            class="ml-4"
            color="#20B2AA"
            rounded
            depressed
            dark
            :loading="loading"
            @click="createField"
          >
            Create new field
          </v-btn>
        </div>
        <v-snackbar v-model="snackbar" text :color="color" absolute bottom>
          {{ message }}
        </v-snackbar>
      </template>
    </card>
  </v-dialog>
</template>

<script>
import Card from "@/components/Base/Card";
import FieldCreator from "@/components/Entity/EntityFields/FieldCreator/FieldCreator";
import { useSchema } from "@/composables/schema";
import { useSnackbar } from "@/composables/snackbar";
import { computed, ref } from "@vue/composition-api";
export default {
  name: "EntityFieldCreationDialog",
  components: { FieldCreator, Card },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    scope: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const schemaEntity = ref(null);
    const { create, loading, error } = useSchema();
    const { show: showSnackbar, snackbar, message, color } = useSnackbar();
    const computedShow = computed({
      get() {
        return props.show;
      },
      set(val) {
        return emit("update:show", val);
      },
    });
    const onEdit = (editedSchemaEntity) =>
      (schemaEntity.value = editedSchemaEntity);
    const closeDialog = () => (computedShow.value = false);
    return {
      loading,
      error,
      snackbar,
      message,
      color,
      computedShow,
      closeDialog,
      createField: () =>
        create({
          ...schemaEntity.value,
          schema: JSON.stringify(schemaEntity.value.schema),
        }).then(() => {
          if (error.value) {
            showSnackbar(error.value, { color: "error" });
          } else {
            showSnackbar("New field schema was successfully applied");
            setTimeout(closeDialog, 1000);
          }
        }),
      onEdit,
    };
  },
};
</script>

<style scoped></style>
