<template>
  <div class="history-card-changes-container">
    <div v-for="(change, i) in computedChanges" :key="i">
      <span class="action"> {{ change.action }}</span>
      <span class="property"> {{ change.property }}</span>
      <span class="change" v-if="hasFromValue(change) && hasToValue(change)">
        from
        <history-changes-value
          color="#c25252"
          :value="change.from"
          :minified="minified"
          :expanded="isExpanded(i)"
          @expand="toggleExpandValue(i, [change.from, change.to])"
        />
        to
        <history-changes-value
          color="#58a13c"
          :value="change.to"
          :minified="minified"
          :expanded="isExpanded(i)"
          @expand="toggleExpandValue(i, [change.from, change.to])"
        />
      </span>
      <span class="value" v-if="hasValue(change)">
        value
        <history-changes-value
          :color="change.action === 'deleted' ? '#c25252' : 'primary'"
          :value="change.value"
          :minified="minified"
          :expanded="isExpanded(i)"
          @expand="toggleExpandValue(i, [change.value])"
        />
      </span>
      <v-container
        fluid
        class="px-0"
        v-if="expandedValues && expandedValues.index === i"
      >
        <v-row dense>
          <v-col v-for="(value, i) in expandedValues.values" :key="i">
            <div class="history-card-changes-json">
              <vue-json-pretty
                :showLine="false"
                :showDoubleQuotes="false"
                :data="value"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <span v-if="minified && changes.length > 5">...</span>
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import HistoryChangesValue from "@/components/Entity/EntityCommonComponents/History/HistoryChangesValue";

export default {
  name: "HistoryChanges",
  components: { HistoryChangesValue, VueJsonPretty },
  props: {
    changes: {
      type: Array,
      required: true,
    },
    minified: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    expandedValues: null,
  }),
  computed: {
    computedChanges() {
      return this.minified ? this.changes.slice(0, 5) : this.changes;
    },
  },
  methods: {
    hasFromValue(change) {
      return "from" in change;
    },
    hasToValue(change) {
      return "to" in change;
    },
    hasValue(change) {
      return "value" in change;
    },
    isExpanded(index) {
      return this.expandedValues?.index === index;
    },
    toggleExpandValue(index, values) {
      if (this.expandedValues?.index === index) {
        this.expandedValues = null;
      } else {
        this.expandedValues = { index, values };
      }
    },
  },
};
</script>

<style scoped lang="scss">
.history-card-changes-container {
  .property {
    color: black;
    font-weight: bold;
  }
}
.history-card-changes-json::v-deep {
  padding: 5px;
  @include border-radius;
  border: 2px solid #eeeeee;
  .is-root {
    .vjs-key,
    .vjs-tree__brackets,
    .vjs-value {
      font-size: 0.8rem !important;
    }
  }
}
</style>
