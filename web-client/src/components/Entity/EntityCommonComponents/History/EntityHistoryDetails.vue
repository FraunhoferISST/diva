<template>
  <v-navigation-drawer
    v-model="computedShow"
    temporary
    color="white"
    right
    fixed
    floating
    width="600px"
    class="history-details-card"
  >
    <v-container fluid class="pa-0">
      <card>
        <v-container fluid slot="body" class="pa-0">
          <v-btn icon @click="computedShow = false">
            <v-icon color="error" small> close </v-icon>
          </v-btn>
        </v-container>
        <v-container fluid slot="body" v-if="historyLog.id && show">
          <v-row>
            <v-col cols="12">
              <custom-header text="Issued from" />
            </v-col>
            <v-col cols="12">
              <actor-card :actor="creator">
                <date-display
                  v-if="historyLog.createdAt"
                  :date="historyLog.createdAt || ''"
                />
              </actor-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <custom-header text="Changes" />
            </v-col>
            <v-col cols="12">
              <history-changes
                v-if="historyLog.human.length > 0"
                :changes="historyLog.human"
              />
              <no-data-state v-else>
                Probably the update has not produced any data changes and
                differs only in the time stamp of the last update
              </no-data-state>
            </v-col>
          </v-row>
        </v-container>
      </card>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import Card from "@/components/Base/Card";
import CustomHeader from "@/components/Base/CustomHeader";
import DateDisplay from "@/components/Base/DateDisplay";
import HistoryChanges from "@/components/Entity/EntityCommonComponents/History/HistoryChanges";
import NoDataState from "@/components/Base/NoDataState";
import ActorCard from "@/components/User/ActorCard";
export default {
  name: "EntityHistoryDetails",
  components: {
    ActorCard,
    NoDataState,
    HistoryChanges,
    DateDisplay,
    CustomHeader,
    Card,
  },
  props: {
    historyLog: {
      type: [Object],
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    creator() {
      return this.historyLog?.creator || {};
    },
    computedShow: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("update:show", val);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.history-details-user-container {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  column-gap: 16px;
  font-size: 0.9rem;
  .username {
    color: black;
  }
}
.history-details-card {
  padding-bottom: 70px;
  box-shadow: 0 0.7px 2.2px rgba(0, 0, 0, 0.011),
    0 1.7px 5.3px rgba(0, 0, 0, 0.016), 0 3.1px 10px rgba(0, 0, 0, 0.02),
    0 5.6px 17.9px rgba(0, 0, 0, 0.024), 0 10.4px 33.4px rgba(0, 0, 0, 0.029),
    0 25px 80px rgba(0, 0, 0, 0.04);
}
</style>
