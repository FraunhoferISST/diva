<template>
  <no-data-state v-if="!hasThemes" text="You can provide themes here">
  </no-data-state>
  <v-col cols="12" class="px-0" v-else>
    <v-chip
      class="ml-1 mt-1"
      small
      label
      v-for="(theme, i) in themes"
      :key="theme + '_' + i"
    >
      {{ theme }}</v-chip
    >
  </v-col>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "GeneralThemes",
  components: { NoDataState },
  props: {
    themes: {
      type: Array,
      required: true,
    },
  },
  computed: {
    hasThemes() {
      return this.themes && this.themes.length > 0;
    },
  },
};
</script>
