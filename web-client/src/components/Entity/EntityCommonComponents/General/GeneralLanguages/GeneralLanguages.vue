<template>
  <no-data-state v-if="!hasLanguages" text="Select languages"> </no-data-state>
  <div v-else>
    <v-chip
      class="ml-1 mt-1"
      small
      label
      v-for="(language, i) in languages"
      :key="language + '_' + i"
    >
      {{ language.language }} ({{ language.alpha2.toUpperCase() }})
    </v-chip>
  </div>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "GeneralLanguages",
  components: { NoDataState },
  props: {
    languages: {
      type: Array,
      required: true,
    },
  },
  computed: {
    hasLanguages() {
      return this.languages.length > 0;
    },
  },
};
</script>
