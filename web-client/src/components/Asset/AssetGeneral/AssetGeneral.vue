<template>
  <entity-general :id="id"> </entity-general>
</template>

<script>
import EntityGeneral from "@/components/Entity/EntityCommonComponents/General/EntityGeneral";

export default {
  name: "AssetGeneral",
  components: {
    EntityGeneral,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
};
</script>
