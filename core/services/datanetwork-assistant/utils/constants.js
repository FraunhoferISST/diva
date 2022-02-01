const IS_CREATOR_OF_RELATION = "isCreatorOf";
const IS_PART_OF_RELATION = "isPartOf";
const IS_DATA_OWNER_OF_RELATION = "isDataOwnerOf";
const IS_REVIEW_OF_RELATION = "isReviewOf";
const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : [
      "resource.events",
      "asset.events",
      "user.events",
      "review.events",
      "service.events",
    ];

module.exports = {
  IS_REVIEW_OF_RELATION,
  IS_PART_OF_RELATION,
  IS_DATA_OWNER_OF_RELATION,
  IS_CREATOR_OF_RELATION,
  KAFKA_CONSUMER_TOPICS,
};
