<template>
  <div>
    <v-col cols="12">
      <edit-activate-transition>
        <v-text-field
          v-model="editUrl"
          color="info"
          label="HTTP API URL"
          clearable
          autofocus
          outlined
          hide-details
          background-color="transparent"
          class="custom-input"
        >
        </v-text-field>
      </edit-activate-transition>
    </v-col>
  </div>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";

export default {
  name: "GeneralUrlEdit",
  components: { EditActivateTransition },
  props: {
    url: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      editUrl: this.url,
    };
  },
  methods: {
    save() {},
  },
  mounted() {
    this.$parent.$on("save", this.save);
  },
  beforeDestroy() {
    this.$parent.$off("save");
  },
};
</script>
