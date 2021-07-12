<template>
  <v-container fluid>
    <fade-in>
      <div class="fill-height">
        <custom-header text="Under Construction"></custom-header>
        <loading-state-overlay />
      </div>
    </fade-in>
  </v-container>
</template>

<script>
import LoadingStateOverlay from "@/components/Base/LoadingStateOverlay";
import FadeIn from "@/components/Transitions/FadeIn";
import CustomHeader from "@/components/Base/CustomHeader";

export default {
  name: "ResourceDashboard",
  components: {
    CustomHeader,
    FadeIn,
    LoadingStateOverlay,
  },
};
</script>
