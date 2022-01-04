<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <v-btn rounded large text icon v-on="on">
          <user-avatar :image-id="user.imageId || ''" />
        </v-btn>
      </template>

      <v-card class="custom-menu">
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <user-avatar :image-id="user.imageId || ''" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <entity-details-link :id="user.id">
                  {{ user.username }}
                </entity-details-link>
              </v-list-item-title>
              <v-list-item-subtitle> {{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="info" rounded text @click="menu = false">
            Close
          </v-btn>
          <logout-button @click="menu = false" small></logout-button>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import LogoutButton from "./LogoutButton";
import UserAvatar from "@/components/User/UserAvatar";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import EntityUpdateEvents from "@/components/Mixins/EntityUpdateEvents";
export default {
  name: "UserControls",
  mixins: [EntityUpdateEvents],
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
  methods: {
    onUpdateEvent() {
      this.fetchUser();
    },
    fetchUser() {
      return this.$api.users
        .getById(this.id)
        .then(({ data }) => this.$store.dispatch("setUser", data))
        .catch();
    },
  },
};
</script>

<style scoped></style>
