<template>
  <info-block title="Location">
    <template #value>
      <field-editor :data="{ location }" :on-save="updateLocation">
        <template #view="{ state }">
          <no-data-state v-if="!hasLocation" text="Add Location" />
          <location-map v-else :location="state.location" :editable="false" />
        </template>
        <template #edit="{ setPatch, patch }">
          <location-edit
            :location="patch.location"
            @update:location="
              (newLocation) => setPatch({ location: newLocation })
            "
          />
        </template>
      </field-editor>
    </template>
  </info-block>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import LocationMap from "@/components/Charts/LocationMap";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
import LocationEdit from "@/components/Entity/EntityFields/Location/LocationEdit";
import { useEntity } from "@/composables/entity";

export default {
  name: "Location",
  inheritAttrs: false,
  components: {
    LocationEdit,
    FieldEditor,
    InfoBlock,
    LocationMap,
    NoDataState,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { patch, error } = useEntity(props.id);
    return {
      patch,
      error,
    };
  },
  computed: {
    hasLocation() {
      return Object.keys(this.location).length > 0;
    },
  },
  methods: {
    updateLocation(patch) {
      return this.patch(patch).then(() => {
        if (this.error) {
          throw this.error;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
