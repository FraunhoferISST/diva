<template>
  <div class="comment">
    <div class="comment-info">
      <user-avatar :image-id="creatorImageId" :user-id="creatorId" />
      <div>
        <div class="comment-header">
          <h6 class="comment-header-user">
            <entity-details-link
              v-if="creatorExists"
              class="mr-1"
              :id="review.creator.id"
            >
              {{ userName }}
            </entity-details-link>
            <span v-else>
              {{ userName }}
            </span>
          </h6>
          <div v-if="userIsAuthor">
            <v-btn
              v-if="!isEditMode"
              class="mr-2"
              icon
              color="primary"
              small
              @click="enableEditMode"
            >
              <v-icon small> edit </v-icon>
            </v-btn>
            <v-btn
              icon
              color="error"
              small
              @click="showDeleteReviewConfirmationDialog"
            >
              <v-icon small> delete </v-icon>
            </v-btn>
          </div>
        </div>
        <div class="comment-header-details">
          <v-rating
            :value="review.rating"
            hover
            readonly
            color="orange"
            background-color="grey lighten-1"
            size="14"
            dense
          ></v-rating>
          <div class="comment-details-divider"></div>
          <div class="d-flex align-center">
            <date-display :date="review.created" />
          </div>
        </div>
      </div>
    </div>
    <div class="review-content mt-3 px-2 pt-2">
      <div class="comment-text pa-2" v-if="review.reviewText && !isEditMode">
        {{ review.reviewText }}
      </div>
      <review-form
        v-else
        @cancel="disableEditMode"
        :review-text="review.reviewText"
        :rating="review.rating"
      >
        <template #default="{ reviewText, rating }">
          <v-btn
            class="gprimary"
            min-width="150px"
            rounded
            small
            color="primary"
            @click="() => patchReview({ reviewText, rating })"
            :disabled="!reviewText || !(rating > 0)"
            :loading="isLoading"
          >
            Update review
          </v-btn>
        </template>
      </review-form>
    </div>
    <v-snackbar text color="error" v-model="snackbar" absolute>
      {{ snackbarText }}
    </v-snackbar>
    <confirmation-dialog
      v-if="userIsAuthor"
      :show.sync="showConfirmationDialog"
    >
      <template>
        Are you sure you want to delete your review? The changes cannot be
        rolled back!
      </template>
      <template #confirm>
        <v-btn text rounded color="error" @click="deleteReview">
          Delete review
        </v-btn>
      </template>
    </confirmation-dialog>
  </div>
</template>

<script>
import DateDisplay from "@/components/Base/DateDisplay";
import UserAvatar from "@/components/User/UserAvatar";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import ReviewForm from "./ReviewForm";
import ConfirmationDialog from "../../../Base/ConfirmationDialog";
export default {
  name: "ReviewCard",
  components: {
    ConfirmationDialog,
    ReviewForm,
    EntityDetailsLink,
    UserAvatar,
    DateDisplay,
  },
  props: {
    review: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    isEditMode: false,
    isLoading: false,
    snackbar: false,
    showConfirmationDialog: false,
    snackbarText: "",
  }),
  computed: {
    user() {
      return this.$store.state.user;
    },
    userIsAuthor() {
      return this.user.id === this.review.creatorId;
    },
    creatorExists() {
      return !!this.review?.creator?.username;
    },
    userName() {
      return this.review.creator?.username || "N/A";
    },
    creatorImageId() {
      return this.review.creator?.entityIcon || "";
    },
    creatorId() {
      return this.review.creator?.id || "";
    },
  },
  methods: {
    enableEditMode() {
      this.isEditMode = true;
    },
    disableEditMode() {
      this.isEditMode = false;
    },
    patchReview(reviewData) {
      this.isLoading = true;
      this.$api.reviews
        .patch(this.review.id, reviewData)
        .then(() => (this.isEditMode = false))
        .catch((e) => {
          this.snackbarText =
            e.response?.data?.message ??
            e?.error ??
            "Some error occurred. Please try again!";
          this.snackbar = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    showDeleteReviewConfirmationDialog() {
      this.showConfirmationDialog = true;
    },
    deleteReview() {
      this.isLoading = true;
      this.$api.reviews
        .delete(this.review.id)
        .then(() => (this.isEditMode = false))
        .catch((e) => {
          this.snackbarText =
            e.response?.data?.message ??
            e?.error ??
            "Some error occurred. Please try again!";
          this.snackbar = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.comment {
  background-color: $bg_card;
  position: relative;
  @include border-radius();
}
.comment-info {
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-column-gap: 16px;
}
.comment-header {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.comment-header-details {
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-column-gap: 8px;
}
.comment-header-user {
  @include font-style(1rem, $font_body, bold, $font_primary_color);
}
.review-content {
  margin-left: 64px;
}
.comment-text {
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
