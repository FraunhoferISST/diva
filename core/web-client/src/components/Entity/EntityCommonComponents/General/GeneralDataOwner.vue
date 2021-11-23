<template>
  <no-data-state
    v-if="!ownerId || !owner.id"
    text="Select Resource Data Owner"
  />
  <user-link v-else :user="owner" />
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import UserLink from "@/components/Base/UserLink";
export default {
  name: "GeneralDataOwner",
  components: { UserLink, NoDataState },
  props: {
    owner: {
      type: Object,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
