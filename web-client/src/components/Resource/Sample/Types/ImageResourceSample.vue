<template>
  <v-row v-if="data">
    <v-col cols="12">
      <card header="Image Thumbnail">
        <template slot="body">
          <img
            alt="Image sample"
            :src="`data:image/jpg;base64,${imageSample}`"
            v-if="imageSample"
          />
          <no-data-state v-else text="No sample available" />
        </template>
      </card>
    </v-col>
  </v-row>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import Card from "@/components/Base/Card";

export default {
  name: "ImageSample",
  components: { Card, NoDataState },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    imageSample() {
      return this.data.imageThumbnail;
    },
  },
};
</script>

<style scoped lang="scss"></style>
