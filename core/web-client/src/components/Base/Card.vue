<template>
  <div
    class="card"
    :class="{ 'with-padding': padding, rounded: rounded, hoverable: hover }"
  >
    <div v-if="header || hasHeaderSlot">
      <h2 class="card-header" :class="{ 'mb-3': header }">
        {{ header }}
        <slot name="header"></slot>
      </h2>
    </div>
    <!--<div class="dash-divider" v-if="header"></div>-->
    <div class="card-body">
      <slot name="body"></slot>
    </div>
    <div class="divider" v-if="footer"></div>
    <div v-if="footer">
      <h2 class="card-footer">{{ footer }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    header: {
      type: String,
    },
    footer: {
      type: String,
    },
    padding: {
      type: Boolean,
      default: true,
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    hover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasHeaderSlot() {
      return this.$slots.header;
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  transition: 0.3s;
  width: 100%;
  height: 100%;
  background-color: $bg_card;
  position: relative;
  display: grid;
  //grid-row-gap: 16px;
  grid-template-areas:
    "header"
    "body";
  grid-template-rows: max-content 1fr;
  grid-auto-columns: minmax(50px, auto);
  &.with-padding {
    padding: 16px;
  }
  &.rounded {
    @include border-radius;
  }
  &.hoverable:hover {
    box-shadow: 0 0px 15px 2px rgba(black, 0.05);
  }
}

.card-body {
  grid-area: body;
}

.card-header,
.card-footer {
  @include font-style(1.15rem, $font_header, bold, $font_primary_color);
  letter-spacing: 0.06rem;
  display: inline-block;
}

.card-header {
  grid-area: header;
}

.divider {
  background-color: transparent;
  height: 2px;
  //background-color: #f4f7fc; //$app_color;
}
</style>
