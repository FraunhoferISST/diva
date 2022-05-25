<template>
  <div>
    <navigation-overlay :open.sync="overlay" v-if="user">
      <user-navigation-overlay-content />
    </navigation-overlay>
    <v-btn rounded width="70px" height="70px" text icon @click="toggleOverlay">
      <entity-avatar
        :image-id="user.entityIcon || ''"
        :entity-id="user.id || ''"
        :entity-title="user.username || ''"
      />
    </v-btn>
  </div>
</template>

<script>
import NavigationOverlay from "@/components/Navigation/NavigationOverlay";
import UserNavigationOverlayContent from "@/components/Navigation/UserNavigationOverlayContent";
import EntityAvatar from "@/components/Entity/EntityAvatar";
import { useUser } from "@/composables/user";

export default {
  name: "UserControls",
  components: {
    EntityAvatar,
    UserNavigationOverlayContent,
    NavigationOverlay,
  },
  setup() {
    const { user } = useUser();
    return {
      user,
    };
  },
  data() {
    return {
      overlay: false,
    };
  },
  methods: {
    toggleOverlay() {
      this.overlay = !this.overlay;
    },
  },
};
</script>

<style scoped></style>
