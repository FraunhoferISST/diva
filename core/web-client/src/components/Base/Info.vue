<template>
  <div>
    <h3 class="stat-name">
      {{ info.name }}
    </h3>
    <p class="stat-value">
      {{ info.value }}
    </p>
  </div>
</template>

<script>
export default {
  name: "Info",
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.stat-name {
  font-size: 0.7rem;
  color: $font_secondary_color;
  letter-spacing: 0.1rem;
  font-weight: bold;
}

.stat-value {
  font-size: 0.7rem;
  font-family: $font_header;
  text-transform: uppercase;
  color: $font_primary_color;
  letter-spacing: 0.06rem;
  font-weight: bold;
  margin: 0;
}
</style>
