<template>
  <div class="comment">
    <div class="comment-header">
      <user-avatar :image-id="creatorImageId" />
      <div>
        <h6 class="comment-header-user">
          <entity-details-link
            v-if="creatorExists"
            class="mr-1"
            :id="data.creator.id"
          >
            {{ userName }}
          </entity-details-link>
          <span v-else>
            {{ userName }}
          </span>
        </h6>
        <div class="comment-header-details">
          <v-rating
            :value="data.rating"
            hover
            readonly
            color="orange"
            background-color="grey lighten-1"
            size="14"
            dense
          ></v-rating>
          <div class="comment-details-divider"></div>
          <div class="d-flex align-center">
            <date-display :date="data.created" />
          </div>
        </div>
      </div>
    </div>
    <div class="comment-text mt-3 pa-2" v-if="data.reviewText">
      {{ data.reviewText }}
    </div>
  </div>
</template>

<script>
import DateDisplay from "@/components/Base/DateDisplay";
import UserAvatar from "@/components/User/UserAvatar";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
export default {
  name: "ReviewCard",
  components: { EntityDetailsLink, UserAvatar, DateDisplay },
  props: {
    data: {
      type: Object,
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
      return this.data.creator?.username || "N/A";
    },
    creatorImageId() {
      return this.data.creator?.imageId || "";
    },
  },
};
</script>

<style scoped lang="scss">
.comment {
  background-color: $bg_card;
  padding: 16px;
  @include border-radius();
  //include gradient-primary(0.2, 0.3);
  //background-color: rgba($c_accent_primary, 0.1);
}
.comment-header {
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-column-gap: 16px;
}
.comment-header-details {
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-column-gap: 8px;
}
.comment-header-user {
  @include font-style(1rem, $font_body, bold, $font_primary_color);
}
.comment-text {
  margin-left: 64px;
  border: 1px #eeeeee solid;
  @include border-radius-half();
  @include font-style(0.9rem, $font_body, bold, $font_secondary_color);
}
.comment-details-divider {
  height: 100%;
  width: 3px;
  position: relative;
  &:after {
    content: "";
    display: block;
    width: 3px;
    height: 3px;
    background: gray;
    border-radius: 3px;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>
