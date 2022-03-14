<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="8">some content</v-col>
      <v-col cols="12" sm="4">
        <v-row>
          <v-col cols="12">
            <user-avatar :image-id="user.entityIcon" :user-id="user.id" />
          </v-col>
          <v-col cols="12">
            <entity-details-link :id="user.id">
              {{ user.username }}
            </entity-details-link>
          </v-col>
          <v-col cols="12">
            <entity-details-link :id="user.id">
              {{ user.email }}
            </entity-details-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LogoutButton from "./LogoutButton";
import UserAvatar from "@/components/User/UserAvatar";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
export default {
  name: "UserNavigationOverlayContent",
  components: { EntityDetailsLink, UserAvatar, LogoutButton },
  data() {
    return {
      menu: false,
      tile: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {},
};
</script>

<style scoped></style>
