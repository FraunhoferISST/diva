const IS_CREATOR_OF_RELATION = "isCreatorOf";
const IS_PART_OF_RELATION = "isPartOf";
const IS_DATA_OWNER_OF_RELATION = "isOwnerOf";
const IS_REVIEW_OF_RELATION = "isReviewOf";
const KAFKA_CONSUMER_TOPICS = [
  {
    topic: "entity.events",
    spec: {
      name: "asyncapi",
    },
  },
];

module.exports = {
  IS_REVIEW_OF_RELATION,
  IS_PART_OF_RELATION,
  IS_DATA_OWNER_OF_RELATION,
  IS_CREATOR_OF_RELATION,
  KAFKA_CONSUMER_TOPICS,
};
