<template>
  <v-container class="pa-0">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>
              <h2>Destroy Claim valid when</h2>
            </v-list-item-title>
            <v-list-item-subtitle>
              <h2>
                <entity-details-link :id="entityId">{{
                  entityTitle
                }}</entity-details-link>
              </h2>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>
              <h2>has Value</h2>
            </v-list-item-title>
            <v-list-item-subtitle>
              <h2>
                {{ value.value }}
              </h2>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>
              <h2>in Field</h2>
            </v-list-item-title>
            <v-list-item-subtitle>
              <h2>
                {{ value.field }}
              </h2>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
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

    return {
      loading,
      error,
      snackbar,
      message,
      color,
      entityTitle,
      entityId,
    };
  },
};
</script>

<style scoped lang="scss"></style>
