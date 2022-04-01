<template>
  <entity-general :id="id"> </entity-general>
</template>

<script>
import EntityGeneral from "@/components/Entity/EntityCommonComponents/General/EntityGeneral";

export default {
  name: "SystemEntityGeneral",
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
