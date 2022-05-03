<template>
  <info-block title="Location">
    <template #value>
      <field-editor
        :data="{ location }"
        :on-save="updateLocation"
        :editable="editable"
      >
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
import LocationEdit from "@/components/Entity/EntityFields/EntityField/Location/LocationEdit";
import { useEntity } from "@/composables/entity";
import { computed } from "@vue/composition-api";

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
    editable: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const { patch, patchError } = useEntity(props.id);
    return {
      hasLocation: computed(() => Object.keys(props.location ?? {}).length > 0),
      updateLocation: (locationPatch) =>
        patch(locationPatch).then(() => {
          if (patchError.value) {
            throw patchError.value;
          }
        }),
    };
  },
};
</script>

<style scoped lang="scss"></style>
