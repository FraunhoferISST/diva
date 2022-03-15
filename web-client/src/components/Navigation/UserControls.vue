<template>
  <div>
    <navigation-overlay :open.sync="overlay">
      <user-navigation-overlay-content />
    </navigation-overlay>
    <v-btn rounded large text icon @click="toggleOverlay">
      <entity-avatar
        :image-id="user.entityIcon"
        :entity-id="user.id"
        :entity-title="user.username"
      />
    </v-btn>
  </div>
</template>

<script>
import EntityUpdateEvents from "@/components/Mixins/EntityUpdateEvents";
import NavigationOverlay from "@/components/Navigation/NavigationOverlay";
import UserNavigationOverlayContent from "@/components/Navigation/UserNavigationOverlayContent";
import EntityAvatar from "@/components/Entity/EntityAvatar";
export default {
  name: "UserControls",
  mixins: [EntityUpdateEvents],
  components: {
    EntityAvatar,
    UserNavigationOverlayContent,
    NavigationOverlay,
  },
  data() {
    return {
      overlay: false,
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
    toggleOverlay() {
      this.overlay = !this.overlay;
    },
  },
};
</script>

<style scoped></style>
