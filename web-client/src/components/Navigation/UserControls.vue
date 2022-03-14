<template>
  <div>
    <!--    <navigation-overlay :open="overlay">
      <user-navigation-overlay-content />
    </navigation-overlay>-->
    <v-btn rounded large text icon @click="toggleOverlay">
      <user-avatar :image-id="user.entityIcon" :user-id="user.id" />
    </v-btn>
  </div>
</template>

<script>
import UserAvatar from "@/components/User/UserAvatar";
import EntityUpdateEvents from "@/components/Mixins/EntityUpdateEvents";
import NavigationOverlay from "@/components/Navigation/NavigationOverlay";
import UserNavigationOverlayContent from "@/components/Navigation/UserNavigationOverlayContent";
export default {
  name: "UserControls",
  mixins: [EntityUpdateEvents],
  components: { UserNavigationOverlayContent, NavigationOverlay, UserAvatar },
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
