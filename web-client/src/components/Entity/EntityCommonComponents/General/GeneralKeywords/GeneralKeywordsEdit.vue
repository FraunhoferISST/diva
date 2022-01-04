<template>
  <v-col cols="12">
    <edit-activate-transition>
      <v-combobox
        class="custom-autocomplete custom-input"
        v-model="computedKeywords"
        :items="keywords"
        :search-input.sync="keyword"
        hide-selected
        :deletable-chips="true"
        label="Manage the keywords"
        multiple
        persistent-hint
        small-chips
        clearable
        outlined
        background-color="transparent"
        hide-details
        autofocus
      >
        <template slot="no-data">
          <v-list-item dense>
            <v-list-item-content>
              <v-list-item-title>
                <p class="ma-0">
                  Press <kbd>enter</kbd> or <kbd>tab</kbd> to add a new keyword
                </p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-combobox>
    </edit-activate-transition>
  </v-col>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";
export default {
  name: "GeneralKeywordsEdit",
  components: { EditActivateTransition },
  props: {
    keywords: {
      required: true,
    },
  },
  data: () => ({
    keyword: null,
  }),
  computed: {
    computedKeywords: {
      get() {
        return this.keywords ?? [];
      },
      set(value) {
        this.$emit("update:keywords", { keywords: value });
      },
    },
  },
};
</script>
