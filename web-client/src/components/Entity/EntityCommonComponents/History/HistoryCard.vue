<template>
  <fade-in>
    <div class="history-card-container">
      <div
        class="history-card-connector-container"
        :class="{ 'without-connector': hideConnector }"
      ></div>
      <div class="">
        <div class="history-card">
          <div class="history-info-container">
            <user-avatar
              :image-id="creatorImageId"
              :size="36"
              :user-id="creatorId"
            />
            <div class="d-flex justify-space-between">
              <h6
                class="history-card-title d-flex align-center"
                style="height: 100%"
              >
                <entity-details-link
                  v-if="creatorExists"
                  class="mr-1"
                  :id="data.creator.id"
                >
                  {{ userName }}
                </entity-details-link>
                <span v-else class="history-card-title-creator mr-1">
                  {{ userName }}
                </span>
                {{ actionType }}
                <span class="history-card-title-divider mx-2"></span>
                <date-display :date="data.created" />
              </h6>
              <v-btn icon color="primary" @click="emitSelect">
                <v-icon small>more_vert</v-icon>
              </v-btn>
            </div>
          </div>

          <div class="history-payload mt-2" v-if="data.human.length > 0">
            <history-changes :changes="data.human" :minified="true" />
          </div>
          <no-data-state class="mt-2" v-else>
            Probably the update has not produced any data changes and differs
            only in the time stamp of the last update
          </no-data-state>
        </div>
      </div>
    </div>
  </fade-in>
</template>

<script>
import FadeIn from "@/components/Transitions/FadeIn";
import UserAvatar from "@/components/User/UserAvatar";
import DateDisplay from "@/components/Base/DateDisplay";
import HistoryChanges from "@/components/Entity/EntityCommonComponents/History/HistoryChanges";
import NoDataState from "@/components/Base/NoDataState";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";

export default {
  name: "HistoryCard",
  components: {
    EntityDetailsLink,
    NoDataState,
    HistoryChanges,
    DateDisplay,
    UserAvatar,
    FadeIn,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    last: {
      type: Boolean,
      required: true,
    },
    first: {
      type: Boolean,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    creatorExists() {
      return !!this.data?.creator?.username;
    },
    userName() {
      if (this.user.id === this.data.creator?.id) {
        return "You";
      }
      return this.data.creator?.username || "N/A";
    },
    creatorImageId() {
      return this.data.creator?.entityIcon || "";
    },
    creatorId() {
      return this.data.creator?.id || "";
    },
    actionType() {
      return this.data.delta.id ? "created" : "updated";
    },
    hideConnector() {
      return this.last || this.count === 1;
    },
  },
  methods: {
    emitSelect() {
      this.$emit("selected");
    },
  },
};
</script>

<style scoped lang="scss">
.history-card-container {
  position: relative;
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column-gap: 16px;
}
.history-info-container {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column-gap: 10px;
}
.history-card-connector-container {
  height: 100%;
  width: 16px;
  position: relative;
  &:before {
    content: "";
    display: inline-block;
    position: absolute;
    width: 2px;
    height: 115%;
    background-color: #dedfff;
    top: 35px;
    left: 0;
    right: 0;
    margin: auto;
  }
  &:after {
    content: "";
    display: inline-block;
    width: 16px;
    border: 2px solid $bg_primary;
    border-radius: 50%;
    height: 16px;
    background-color: #dedfff;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    top: 20px;
  }
  &.without-connector {
    &:before {
      display: none;
    }
  }
}
.history-card-container {
  width: 100%;
}
.history-card {
  padding: 10px;
  @include border-radius();
  background-color: $bg_card;
}
.history-card-title {
  @include font-style(1rem, $font_body, bold, $font_secondary_color);
}

.history-card-title-divider {
  background-color: $font_secondary_color;
  display: inline-block;
  height: 2px;
  width: 2px;
}

.history-card-title-creator {
  @include font-style(1rem, $font_body, bold, $font_primary_color);
}
.history-card-title-date {
  @include font-style(1rem, $font_body, bold, $font_secondary_color);
}
.history-payload {
  margin-left: 44px;
  @include border-radius-half();
}
</style>
