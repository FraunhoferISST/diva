const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const EntityService = require("@diva/common/api/EntityService");
const generateUuid = require("@diva/common/generateUuid");
const {
  reviewsMongoDbConnector,
  historyMongoDbConnector,
} = require("../utils/mongoDbConnectors");
const { notReviewAuthorError } = require("../utils/errors");

const REVIEW_ROOT_SCHEMA = process.env.USER_ROOT_SCHEMA || "review";
const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

const reviewsCollectionName = process.env.MONGO_COLLECTION_NAME || "reviews";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

class ReviewsService extends EntityService {
  async init() {
    await jsonSchemaValidator.init([REVIEW_ROOT_SCHEMA, HISTORY_ROOT_SCHEMA]);
    await historyMongoDbConnector.connect();
    await reviewsMongoDbConnector.connect();
    this.collection =
      reviewsMongoDbConnector.collections[reviewsCollectionName];
    await this.collection.createIndex(
      { creatorId: 1, belongsTo: 1 },
      { unique: true }
    );
    this.historyCollection =
      historyMongoDbConnector.collections[historyCollectionName];
    this.jsonSchemaValidator = jsonSchemaValidator;
  }

  async create(review, actorId) {
    return super.create(
      {
        ...review,
        id: generateUuid("review"),
        entityType: "review",
      },
      actorId
    );
  }

  async deleteById(id, actorId) {
    const existingReview = await this.collection.findOne({ id });
    if (existingReview && actorId !== existingReview.creatorId) {
      throw notReviewAuthorError;
    }
    return super.deleteById(id, actorId);
  }

  async patchById(id, patch, actorId) {
    const existingReview = await this.collection.findOne({ id });
    if (existingReview && actorId !== existingReview.creatorId) {
      throw notReviewAuthorError;
    }
    return super.patchById(id, patch, actorId);
  }

  validate(review) {
    jsonSchemaValidator.validate(REVIEW_ROOT_SCHEMA, review);
  }

  sanitizeEntity({ _id, ...rest }) {
    return rest;
  }
}

module.exports = new ReviewsService();
