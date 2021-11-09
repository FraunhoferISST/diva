<template>
  <div class="source-tabs relative">
    <div class="source-tabs-navigation d-flex align-center">
      <div
        class="source-tabs-tab d-flex align-center pr-2"
        v-for="(tabTitle, i) in tabs"
        :key="i"
        :class="{ selected: selectedTab === i }"
      >
        <label
          class="pl-4 pr-1 py-2 ellipsis"
          :for="`${tabTitle}#${i}`"
          :class="{ 'pr-2': i === 0 }"
        >
          {{ tabTitle }}
          <input
            type="radio"
            :id="`${tabTitle}#${i}`"
            :checked="selectedTab === i"
            @input="() => (selectedTab = i)"
          />
        </label>
        <v-btn icon small color="error" v-if="i > 0">
          <v-icon color="error" small @click="() => emitRemoveTab(i)">
            close
          </v-icon>
        </v-btn>
      </div>
      <div class="px-2 source-tabs-tab">
        <v-btn icon color="primary" small @click="emitAddTab">
          <v-icon color="primary" dense> add </v-icon>
        </v-btn>
      </div>
    </div>
    <div class="source-tab-content">
      <slot :selected="selectedTab"> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "SourceTabs",
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    selectedTab: 0,
  }),
  methods: {
    emitAddTab() {
      this.$emit("add");
    },
    emitRemoveTab(i) {
      if (this.selectedTab >= i) {
        this.selectedTab -= 1;
      }
      this.$emit("remove", i);
    },
  },
};
</script>

<style scoped lang="scss">
.source-tabs {
  input[type="radio"] {
    display: none;
  }
}
.source-tabs-navigation {
  max-width: 100%;
  flex-flow: row nowrap;
  align-content: end;
}
.source-tabs-tab {
  max-width: 130px;
  min-width: 0;
  transition: 0.3s;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  label {
    transition: 0.3s;
    cursor: pointer;
    background-color: white;
    border-radius: 8px; //8px 8px 0 0;
  }
  &.selected {
    background-color: $bg_card_secondary;
    label {
      background-color: $bg_card_secondary;
    }
  }
}
.source-tab-content {
  background-color: $bg_card_secondary;
  border-radius: 0 0 8px 8px;
}
</style>
