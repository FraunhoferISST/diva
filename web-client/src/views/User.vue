<template>
  <user-details :id="id" />
</template>

<script>
import UserDetails from "@/components/User/UserDetails";
export default {
  name: "User",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: { UserDetails },
};
</script>

<style scoped></style>
