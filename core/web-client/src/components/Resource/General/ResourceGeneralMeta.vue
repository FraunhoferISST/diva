<template>
  <entity-general-meta :metadata="metadata" />
</template>

<script>
import formattedMetadata from "@/components/Entity/EntityCommonComponents/General/GeneralMetaHelpers/formattedMetadata";
import EntityGeneralMeta from "@/components/Entity/EntityCommonComponents/General/EntityGeneralMeta";

export default {
  name: "ResourceGeneralMeta",
  components: {
    EntityGeneralMeta,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    resourceType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      metadata: [],
    };
  },
  methods: {
    formatMeta(data) {
      return formattedMetadata(data, this.resourceType.group);
    },
  },
};
</script>

<style scoped></style>
