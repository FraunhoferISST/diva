<template>
  <v-container class="pa-0">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <h2>Condition is fulfilled if{{ evaluationMethodText }}:</h2>
        <h2>
          <entity-details-link v-if="fromEntityId !== ''" :id="fromEntityId">{{
            fromEntityTitle
          }}</entity-details-link>
          <v-chip v-if="fromEntityId === ''" label>{{ fromNodeText }}</v-chip>
          has a
          <v-chip label>{{ relationText }}</v-chip>
          <v-chip label>{{ relationTypeText }}</v-chip>
          to
          <entity-details-link v-if="toEntityId !== ''" :id="toEntityId">{{
            toEntityTitle
          }}</entity-details-link>
          <v-chip v-if="toEntityId === ''" label>{{ toNodeText }}</v-chip>
        </h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";
import { useApi } from "@/composables/api";
import { ref, computed } from "@vue/composition-api";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";

export default {
  name: "StdDivaEntityRelationViewer",
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

    const fromEntityTitle = ref("");
    const fromEntityId = ref("");
    const toEntityTitle = ref("");
    const toEntityId = ref("");

    const getEntity = async (id, fromTo = "from") => {
      const { data } = await getEntityApiById(id)
        .getByIdIfExists(id)
        .catch((e) => {
          if (e?.response?.status === 403) {
            return null;
          }
          throw e;
        });
      if (fromTo === "from") {
        fromEntityTitle.value = data.title || data.username;
        fromEntityId.value = data.id;
      } else {
        toEntityTitle.value = data.title || data.username;
        toEntityId.value = data.id;
      }
    };

    const fromNodeText = ref("");
    if ("from" in props.value) {
      getEntity(props.value.from);
      fromNodeText.value = `entity ${props.value.from}`;
    } else if ("fromNodeType" in props.value) {
      fromNodeText.value = `entity with type(s) ${props.value.fromNodeType.join(
        ", "
      )}`;
    } else {
      fromNodeText.value = "any entity";
    }
    const relationText = ref("");
    if ("bidirectional" in props.value && props.value.bidirectional) {
      relationText.value = "bidirectional relation";
    } else {
      relationText.value = "directed relation";
    }
    const relationTypeText = ref("");
    if ("edgeTypes" in props.value) {
      relationTypeText.value = `(${props.value.edgeTypes.join(", ")})`;
    } else {
      relationTypeText.value = "with any type";
    }
    const toNodeText = ref("");
    if ("to" in props.value) {
      getEntity(props.value.to);
      toNodeText.value = `entity ${props.value.to}`;
    } else if ("toNodeType" in props.value) {
      toNodeText.value = `any other (${props.value.toNodeType.join(
        ", "
      )}) entity`;
    } else {
      toNodeText.value = "any other entity";
    }

    const evaluationMethodText = ref("");
    if (
      "evaluationMethod" in props.value &&
      props.value.evaluationMethod === "relationExists"
    ) {
      evaluationMethodText.value = "";
    } else {
      evaluationMethodText.value = " not";
    }

    return {
      loading,
      error,
      snackbar,
      message,
      color,
      fromNodeText,
      relationText,
      relationTypeText,
      toNodeText,
      evaluationMethodText,
      fromEntityTitle,
      fromEntityId,
      toEntityTitle,
      toEntityId,
    };
  },
};
</script>

<style scoped lang="scss"></style>
