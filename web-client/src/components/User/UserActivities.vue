<template>
  <section id="user-activities">
    <v-tabs v-model="tab" background-color="white" show-arrows>
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="(tab, i) in tabs" :key="i">
        <v-icon small class="mr-md-2">
          {{ tab.icon }}
        </v-icon>
        <span class="d-none d-md-inline">{{ tab.title }}</span>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="tab in tabs" :key="tab.title">
        <user-activities-list
          :id="id"
          :activity="tab.activity"
          :entity-type="tab.entityType"
        />
      </v-tab-item>
    </v-tabs-items>
  </section>
</template>

<script>
import { ref } from "@vue/composition-api";
import UserActivitiesList from "@/components/User/UserActivitiesList";

export default {
  name: "UserActivities",
  components: {
    UserActivitiesList,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const tabs = ref([
      {
        title: "Likes",
        icon: "favorite",
        activity: "likes",
        entityType: "",
      },
      {
        title: "Reviews",
        icon: "question_answer",
        activity: "isCreatorOf",
        entityType: "review",
      },
      {
        title: "Created",
        icon: "add",
        activity: "isCreatorOf",
        entityType: "",
      },
      {
        title: "Owned",
        icon: "supervisor_account",
        activity: "isOwnerOf",
        entityType: "",
      },
    ]);
    const tab = ref(0);
    return {
      tabs,
      tab,
    };
  },
};
</script>

<style lang="scss"></style>
