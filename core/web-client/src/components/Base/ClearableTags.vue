<template>
  <div
    class="clearable-tag-container"
    :class="{ dark: dark, removed: removed, link: !!href }"
  >
    <div class="d-flex align-center justify-space-between">
      <span v-if="!href" class="clearable-tag mr-2 text-truncate" :title="item"
        >{{ item }}
      </span>
      <router-link
        class="clearable-tag mr-2 text-truncate"
        v-else
        :to="href"
        :title="item"
        target="_blank"
      >
        {{ item }}
      </router-link>
      <v-btn
        v-if="clearable"
        text
        icon
        small
        color="error"
        class="ma-0"
        @click="removeItem()"
      >
        <custom-icon icon="close" small color="gred" />
      </v-btn>
    </div>
  </div>
</template>

<script>
import CustomIcon from "@/components/Base/CustomIcon";
export default {
  name: "ClearableTags",
  components: { CustomIcon },
  data: () => ({
    removed: false,
  }),
  props: {
    item: {
      type: String,
      required: true,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true,
    },
    dark: {
      type: Boolean,
      required: false,
      default: false,
    },
    href: {
      type: String,
      required: false,
      default: "",
    },
  },
  methods: {
    removeItem() {
      this.removed = true;
      setTimeout(() => {
        this.$emit("remove", this.item);
        this.removed = false;
      }, 300);
    },
  },
};
</script>

<style scoped lang="scss">
.clearable-tag-container {
  position: relative;
  display: inline-block;
  z-index: 1;
  overflow: hidden;
  transition: 0.3s;
  //opacity: 0;
  border-radius: 50px;
  padding: 2px 0 2px 10px;
  margin: 5px;
  max-width: 180px;
  background-color: $btn_flat;

  &.link {
    .clearable-tag {
      &:hover {
        color: rgba($c_accent_primary, 1);
      }
    }
  }

  &.dark {
    background-color: rgba($bg_card, 0.5);
    @include gradient-primary(0.5, 0.5, true);

    .clearable-tag {
      color: white;
    }

    &.link {
    }
  }

  &.removed {
    opacity: 0;
    transform: scale(0);
  }

  .clearable-tag {
    font-size: 0.8rem;
    transition: 0.3s;
    padding: 2px 0;
    display: inline-block;
    color: rgba($font_primary_color, 1);
    font-weight: 700;
    width: 80%;
    //padding-top: 10px;
    max-width: 180px;
  }
}
</style>
