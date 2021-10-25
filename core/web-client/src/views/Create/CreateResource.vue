<template>
  <v-container fluid class="create-container fill-height">
    <v-row align="center" justify="center">
      <v-col
        cols="12"
        sm="12"
        md="12"
        lg="9"
        xl="7"
        class="elevation-0 create-card pa-0"
      >
        <create-resource-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CreateResourceForm from "@/components/Resource/Create/CreateResourceForm";
export default {
  name: "CreateResource",
  components: { CreateResourceForm },
};
</script>

<style scoped lang="scss">
.create-container {
  background-color: transparent;
}

.create-card {
  min-height: 60vh;
  overflow: hidden;
  position: relative;
  @include border-radius();
  background: white;

  & *:not(i) {
    font-family: Quicksand;
  }
}

@media screen and (max-width: 959px) {
  .create-card {
    min-height: unset;
  }
}
</style>
