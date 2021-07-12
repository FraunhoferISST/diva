<template>
  <div class="expansion-container pb-1 pt-4" :class="{ expanded: expanded }">
    <div
      class="expansion-content"
      :class="{ expanded: expanded }"
      :style="{ 'max-height': height + 'px' }"
    >
      <slot> </slot>
    </div>
    <v-btn
      v-if="itemsCount > 12"
      class="expansion-toggle ma-0"
      icon
      flat
      color="default"
      @click="expanded = !expanded"
    >
      <custom-icon icon="expand_more" />
    </v-btn>
  </div>
</template>

<script>
import CustomIcon from "@/components/Base/CustomIcon";
export default {
  name: "ExpansionPanel",
  components: { CustomIcon },
  data: function () {
    return {
      expanded: this.itemsCount < 13,
    };
  },
  props: {
    height: {
      type: Number,
      required: false,
      default: 110,
    },
    itemsCount: {
      type: Number,
      required: true,
    },
  },
  methods: {},
  computed: {},
};
</script>

<style scoped lang="scss">
.expansion-container {
  transition: 0.5s;
  position: relative;
  border-bottom: 1px solid $bg_primary;
  border-top: 1px solid $bg_primary;
  &.expanded {
    padding-bottom: 20px;
    &:after {
      height: 0%;
    }

    .expansion-toggle {
      bottom: -15px;
      transform: rotate(180deg);
    }
  }

  &:after {
    transition: 0.5s;
    position: absolute;
    display: block;
    content: "";
    width: 100%;
    background: linear-gradient(
      0deg,
      $bg_card 10%,
      rgba(255, 255, 255, 0) 100%
    );
    height: 40%;
    bottom: 0;
    left: 0;
  }
}

.expansion-content {
  transition: 0.5s;
  overflow: hidden;
  &.expanded {
    padding-bottom: 20px;
    max-height: 600px !important;
  }
}

.expansion-toggle {
  position: absolute !important;
  bottom: -25px;
  left: 47%;
  z-index: 3;
}
</style>
