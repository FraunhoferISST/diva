<template>
  <div>
    <v-btn icon width="100px" height="100px" @click="toggleEditor">
      <entity-avatar
        size="100"
        :entity-id="entity.id"
        :image-id="entity.entityIcon"
        :entity-title="entity.title || entity.username"
      />
    </v-btn>
    <entity-media-editor :open.sync="showEditor" :entity="entity" />
  </div>
</template>

<script>
import EntityAvatar from "@/components/Entity/EntityAvatar";
import EntityMediaEditor from "@/components/Entity/EntityMedia/EntityMediaEditor";
export default {
  name: "EntityMedia",
  components: { EntityMediaEditor, EntityAvatar },
  props: {
    entity: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    showEditor: false,
  }),
  methods: {
    toggleEditor() {
      this.showEditor = !this.showEditor;
    },
  },
};
</script>

<style scoped></style>
