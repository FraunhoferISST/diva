<template>
  <div class="editable-content" :class="{ 'edit-active': editMode }">
    <div class="fill-height" @click="onContentClick" ref="editor">
      <slot
        name="edit"
        v-if="editMode"
        :set-patch="setPatch"
        :patch="patch"
        :disableEdit="disableEdit"
      >
      </slot>
      <slot name="view" :patch="patch" :state="state" v-else></slot>
    </div>

    <div class="edit-toggle-btn-container">
      <div class="edit-toggle-btn">
        <v-btn
          text
          icon
          :color="!editMode ? 'primary' : 'error'"
          @click="toggleEdit"
          class="control ma-0"
        >
          <v-icon dense v-if="!editMode" color="primary">edit</v-icon>
          <v-icon dense v-else color="error">close</v-icon>
        </v-btn>
        <v-btn
          text
          icon
          color="success"
          @click="save"
          :disabled="!hasChanges"
          class="control ma-0"
          :loading="isLoading"
          v-if="editMode"
        >
          <v-icon dense color="success">done</v-icon>
        </v-btn>
      </div>
    </div>
    <v-snackbar
      absolute
      top
      text
      v-model="snackbar"
      :color="color"
      :timeout="7000"
    >
      {{ message }}
    </v-snackbar>
  </div>
</template>
<script>
import cloneDeep from "lodash.clonedeep";
import { useSnackbar } from "@/composables/snackbar";

export default {
  name: "FieldEditor",
  components: {},
  props: {
    // the initial data
    data: {
      type: Object,
      required: true,
    },
    onSave: {
      type: Function,
      required: true,
    },
    clickableContent: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { message, snackbar, show, c: color } = useSnackbar();
    return {
      showSnackbar: show,
      snackbar,
      message,
      color,
    };
  },
  watch: {
    data() {
      const copy = cloneDeep(this.data);
      this.setState(copy);
      this.setPatch(copy);
    },
  },
  data() {
    return {
      isLoading: false,
      editMode: false,
      // prepared patch (user input)
      patch: cloneDeep(this.data),
      // new consistent state after successful patch request
      state: cloneDeep(this.data),
    };
  },
  computed: {
    hasChanges() {
      const consistentState = JSON.stringify(this.state);
      const patchState = JSON.stringify(this.patch);
      return consistentState !== patchState;
    },
  },
  methods: {
    toggleEdit() {
      this.editMode ? this.disableEdit() : this.activateEdit();
    },
    onContentClick() {
      if (this.clickableContent) {
        this.activateEdit();
      }
    },
    activateEdit() {
      if (this.editMode) return;
      this.patch = cloneDeep(this.state);
      this.editMode = !this.editMode;
    },
    disableEdit() {
      this.editMode = false;
      this.isLoading = false;
      this.snackbar = false;
      this.snackbarText = "";
      this.patch = cloneDeep(this.data);
    },
    setPatch(newValue) {
      this.patch = newValue;
    },
    setState(newValue) {
      this.state = newValue;
    },
    save() {
      this.isLoading = true;
      this.onSave(this.patch)
        .then(() => {
          this.state = cloneDeep(this.patch);
          this.$emit("saved", this.patch);
          this.disableEdit();
        })
        .catch((e) => {
          this.showSnackbar(e.toString(), { color: "error" });
          this.snackbar = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
<style scoped lang="scss">
.editable-content {
  position: relative;
  transition: 0.5s;
  border-radius: $border_radius;
  cursor: pointer;
  margin: -8px;
  padding: 8px;
  &:hover {
    background-color: rgba($bg_primary, 1);
    .edit-toggle-btn-container {
      opacity: 1;
    }
    .edit-toggle-btn {
      max-height: 36px;
    }
  }
  &.edit-active {
    margin: 0;
    padding: 0;
    background-color: rgba($bg_primary, 1);
    .edit-toggle-btn-container {
      opacity: 1;
      max-width: 72px;
    }
  }
}

.edit-toggle-btn-container {
  background-color: $bg_card;
  opacity: 0;
  transition: 0.3s;
  position: absolute !important;
  bottom: -36px;
  right: 0;
  left: 0;
  margin: auto;
  max-width: 36px;
  max-height: 36px;
  border-radius: 0 0 18px 18px;
  z-index: 2;
  box-shadow: 0 10px 15px 3px rgba(black, 0.15);
}

.edit-toggle-btn {
  overflow: hidden;
  border-radius: 0 0 18px 18px;
  max-width: 72px;
  max-height: 36px;
  //@include gradient-primary(0.2, 0.2, true);
  background-color: $bg_primary;
}
</style>
