<template>
  <span class="date-display">
    {{ dateString }}
  </span>
</template>

<script>
import { format, parseISO } from "date-fns";
export default {
  name: "DateDisplay",
  props: {
    date: {
      type: [String, Date],
      required: true,
    },
    format: {
      type: String,
      default: "dd.MM.yyyy HH:mm",
    },
  },
  computed: {
    dateString() {
      return format(parseISO(this.date), this.format);
    },
  },
};
</script>

<style scoped lang="scss">
.date-display {
  @include font-style(0.85rem, $font_header, bold, $font_secondary_color);
}
</style>
