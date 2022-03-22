<template>
  <div class="comment">
    <div class="comment-header d-flex justify-space-between align-center">
      <user-card dense :user="review.creator">
        <template #info>
          <div class="d-flex align-center">
            <v-rating
              :value="review.rating"
              hover
              readonly
              color="orange"
              background-color="grey lighten-1"
              size="14"
              dense
            ></v-rating>
            <dot-divider class="mx-3" />
            <date-display :date="review.created" />
          </div>
        </template>
      </user-card>
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
import ReviewForm from "./ReviewForm";
import ConfirmationDialog from "../../../Base/ConfirmationDialog";
import UserCard from "@/components/User/UserCard";
import DotDivider from "@/components/Base/DotDivider";
export default {
  name: "ReviewCard",
  components: {
    DotDivider,
    UserCard,
    ConfirmationDialog,
    ReviewForm,
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
  position: relative;
}

.review-content {
  margin-left: 34px;
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
