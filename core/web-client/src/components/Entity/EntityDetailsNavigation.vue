<template>
  <div
    class="entity-details-nav-container d-flex align-center"
    :class="{ closed: isSubNavClosed }"
  >
    <aside
      id="entity-details-aside"
      class="elevation-0 d-flex"
      :class="{ closed: isSubNavClosed }"
    >
      <div style="max-width: 100%">
        <div
          class="white d-flex justify-end"
          :class="{ 'pr-3': !isSubNavClosed }"
        >
          <div
            class="toggle-button-container pt-3 text-center"
            :class="{ closed: isSubNavClosed }"
          >
            <btn-wrapper round>
              <v-btn class="ma-0" icon @click="toggleSubNav">
                <custom-icon
                  size="30px"
                  :icon="isSubNavClosed ? 'chevron_right' : 'chevron_left'"
                ></custom-icon>
              </v-btn>
            </btn-wrapper>
          </div>
        </div>
        <entity-details-navigation-overview
          :data="data"
          :closed="isSubNavClosed"
          :id="data.id"
        />
        <div
          id="aside-items-container"
          :class="{ closed: isSubNavClosed }"
          class="mt-3"
        >
          <div
            class="aside-item"
            :class="{ active: item.name === activeRouteName }"
            v-for="(item, i) in links"
            :key="i"
          >
            <router-link :to="{ name: item.name }" :title="item.title">
              <div class="aside-item-icon">
                <v-icon
                  size="20px"
                  :color="item.name === activeRouteName ? 'info' : '#dcdcdc'"
                >
                  {{ item.icon }}
                </v-icon>
              </div>
            </router-link>

            <fade-in>
              <router-link v-if="!isSubNavClosed" :to="{ name: item.name }">
                <div class="aside-item-link">
                  {{ item.title }}
                </div>
              </router-link>
            </fade-in>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import CustomIcon from "@/components/Base/CustomIcon";
import FadeIn from "@/components/Transitions/FadeIn";
import BtnWrapper from "@/components/Base/BtnWrapper";
import EntityDetailsNavigationOverview from "./EntityDetailsNavigationOverview";

export default {
  name: "EntityDetailsNavigation",
  components: {
    EntityDetailsNavigationOverview,
    BtnWrapper,
    FadeIn,
    CustomIcon,
  },
  props: {
    // General Entity data
    data: {
      type: Object,
      required: true,
    },
    // Entity type specific routes
    links: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    active: 0,
    menu: false,
  }),
  computed: {
    activeRouteName() {
      return this.$route.name;
    },
    isSubNavClosed() {
      return !this.$store.state.ui.subNav;
    },
  },
  methods: {
    openSubNav() {
      this.$store.dispatch("openSubNav");
    },
    closeSubNav() {
      this.$store.dispatch("closeSubNav");
    },
    toggleSubNav() {
      this.isSubNavClosed ? this.openSubNav() : this.closeSubNav();
    },
  },
};
</script>

<style scoped lang="scss">
$aside_width: 80px;

.entity-details-nav-container {
  transition: 0.3s;
  height: calc(100vh - 0);
  width: 300px;
  overflow: hidden;
  &.closed {
    width: 80px;
  }
}

#entity-details-aside {
  top: 0;
  position: fixed;
  z-index: 2;
  transition: 0.3s;
  width: 300px;
  @include gradient-toolbar-secondary();
  height: 100%;
  overflow: hidden;
}

#aside-items-container {
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  transition: 0.5s;
}

.aside-item {
  transition: 0.3s;
  text-align: center;
  display: grid;
  grid-template-columns: minmax(60px, 80px) 1fr;
  grid-column-gap: 0;
  grid-row-gap: 0;
  cursor: pointer;
  margin: 10px 10px;
  overflow: hidden;
  @include border-radius;
  &:hover {
    background-color: $bg_toolbar_hover;
  }
  &.active {
    background: $bg_toolbar_hover;
    .aside-item-link {
      color: white;
    }
  }
}

.aside-item-icon {
  transition: 0.3s;
  padding: 10px 0;
  height: 45px;
  img {
    height: 22px !important;
  }
}

.aside-item-link {
  text-align: left;
  transition: 0.3s;
  width: 100%;
  height: 100%;
  padding: 12px 15px 12px 0;
  @include font-style(0.8rem, $font_body, bold, $font_secondary_color_inverse);
  letter-spacing: 0.1rem;
}

a.router-link-active {
  transition: 0.3s;
  color: white;
  font-weight: bold;
  background-color: rgba($btn_flat_secondary_text, 0.6); //$bg_toolbar_hover;
}

.controls-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.resource-quality {
  z-index: -1;
  position: absolute;
  top: -6px;
  left: 5px;

  &:after {
    content: "";
    display: block;
    position: absolute;
    height: 48%;
    bottom: 0;
    width: 100%;
    z-index: 0;
    background-color: $bg_toolbar;
  }
}

.resource-status-icon {
  position: absolute;
  bottom: 0;
  right: 15px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: $bg_toolbar;
}

.resource-card {
  position: relative;
  @include gradient-primary(0.1, 0.1);
  @include border-radius();
  width: 100%;
  //box-shadow: 0 0px 15px 10px rgba(black, 0.05);
}
.closed {
  width: 80px !important;
}

.toggle-button-container {
  transition: 0.5s;
  max-width: 50px;
  &.closed {
    max-width: 100px;
  }
}
</style>
