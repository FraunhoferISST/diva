<template>
  <v-container class="pa-0">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <h2>
          Condition is fulfilled if
          <v-chip label>{{ value.field }}</v-chip>
          in entity
          <entity-details-link :id="entityId">{{
            entityTitle
          }}</entity-details-link>
          {{ operatorText }}
          <v-chip label>{{ value.value }}</v-chip>
        </h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";
import { useApi } from "@/composables/api";
import { ref } from "@vue/composition-api";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";

export default {
  name: "StdDivaPropertyViewer",
  components: {
    EntityDetailsLink,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { snackbar, message, color } = useSnackbar();
    const { loading, error } = useRequest();
    const { getEntityApiById } = useApi();

    const operators = [
      {
        value: "equal",
        display: "equals",
        types: ["string", "number", "boolean"],
      },
      {
        value: "not equal",
        display: "does not equal",
        types: ["string", "number", "boolean"],
      },
      { value: "includes", display: "includes", types: ["string"] },
      { value: "matches", display: "matches", types: ["string"] },
    ];

    const entityTitle = ref("");
    const entityId = ref("");

    const getEntity = async (id) => {
      const { data } = await getEntityApiById(id)
        .getByIdIfExists(id)
        .catch((e) => {
          if (e?.response?.status === 403) {
            return null;
          }
          throw e;
        });
      entityTitle.value = data.title || data.username;
      entityId.value = data.id;
    };

    getEntity(props.value.entityId);
    const operatorText = operators.find(
      (o) => o.value === props.value.operator
    ).display;
    return {
      loading,
      error,
      snackbar,
      message,
      color,
      entityTitle,
      entityId,
      operatorText,
    };
  },
};
</script>

<style scoped lang="scss"></style>
