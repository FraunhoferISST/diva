<template>
  <div>
    <card>
      <v-container>
        <field-creator />
      </v-container>
    </card>
    <router-transition>
      <router-view></router-view>
    </router-transition>
  </div>
</template>

<script>
import RouterTransition from "@/components/Transitions/RouterTransition";
import FieldCreator from "@/components/Entity/EntityFields/FieldCreator/FieldCreator";
import Card from "@/components/Base/Card";
export default {
  name: "Create",
  components: { Card, FieldCreator, RouterTransition },
};
</script>

<style scoped></style>
