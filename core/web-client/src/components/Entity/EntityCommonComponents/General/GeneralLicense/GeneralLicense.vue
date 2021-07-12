<template>
  <div>
    <no-data-state
      v-if="!licenses || licenses.length === 0"
      text="Specify licenses"
    />
    <v-row v-else>
      <v-col cols="12" sm="12" md="6" lg="4" xl="4">
        <a
          v-for="license in licenses"
          class="general-license"
          :key="license"
          :href="license"
          target="_blank"
          @click.stop="() => {}"
        >
          {{ license }}
          <v-icon> link </v-icon>
        </a>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "GeneralLicense",
  components: { NoDataState },
  props: {
    licenses: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.general-license {
  transition: 0.3s;
  color: $c_accent_primary;
  &:hover {
    color: $font_link_color_hover;
  }
}
</style>
