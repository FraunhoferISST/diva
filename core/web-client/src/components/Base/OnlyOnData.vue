<template>
  <v-col class="pa-2" cols="12" sm="6" md="4" lg="2" v-if="hasData">
    <slot> </slot>
  </v-col>
</template>

<script>
export default {
  name: "OnlyOnData",
  props: ["data"],
  computed: {
    hasData() {
      return (
        this.data &&
        (this.data !== "" ||
          (this.data.constructor === Object &&
            Object.entries(this.data).length > 0) ||
          (Array.isArray(this.data) && this.data.length > 0))
      );
    },
  },
};
</script>

<style scoped></style>
