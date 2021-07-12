<template>
  <div class="editable-content" :class="{ 'edit-active': editMode }">
    <div class="fill-height" @click="activateEdit" ref="editor">
      <slot name="edit" v-if="editMode" :update="updateState"></slot>
      <slot name="view" v-if="!editMode"></slot>
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
          class="control ma-0"
          v-if="editMode"
        >
          <v-icon dense color="success">done</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "EditViewContent",
  components: {},
  props: {
    initialData: {
      required: true,
    },
  },
  data() {
    return {
      editMode: false,
      state: this.initialData,
    };
  },
  methods: {
    toggleEdit() {
      this.editMode = !this.editMode;
    },
    activateEdit() {
      if (this.editMode) return;
      this.editMode = !this.editMode;
    },
    disableEdit() {
      this.editMode = false;
    },
    updateState(newValue) {
      this.state = newValue;
    },
    async save() {
      this.$emit("save", this.state);
      this.disableEdit();
    },
  },
};
</script>
<style scoped lang="scss">
.editable-content {
  position: relative;
  transition: 0.5s;
  border-radius: $border_radius / 2;
  cursor: pointer;
  &:hover {
    background-color: rgba($bg_primary, 1);
    //box-shadow: 0 0px 0px 3px rgba($c_accent_primary, 0.05);
    .edit-toggle-btn-container {
      opacity: 1;
    }
    .edit-toggle-btn {
      max-height: 36px;
    }
  }
  &.edit-active {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
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
