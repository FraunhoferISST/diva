<template>
  <info
    :info="{
      name: 'size',
      value: formattedSize,
    }"
  />
</template>
<script>
import byteSize from "byte-size";
import Info from "@/components/Base/Info";
export default {
  name: "InfoSize",
  components: { Info },
  props: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  computed: {
    formattedSize() {
      if (this.unit !== "Bytes") {
        return `${this.value} ${this.unit}`;
      }
      const { value, unit } = byteSize(this.value);
      return `${value} ${unit}`;
    },
  },
};
</script>
