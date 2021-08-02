const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const EntityService = require("@diva/common/api/EntityService");
const generateUuid = require("@diva/common/generateUuid");
const {
  reviewsMongoDbConnector,
  historyMongoDbConnector,
} = require("../utils/mongoDbConnectors");

const REVIEW_ROOT_SCHEMA = process.env.USER_ROOT_SCHEMA || "review";
const reviewsCollectionName = process.env.MONGO_COLLECTION_NAME || "reviews";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

class ReviewsService extends EntityService {
  async init() {
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

  validate(user) {
    jsonSchemaValidator.validate(REVIEW_ROOT_SCHEMA, user);
  }

  sanitizeEntity({ _id, ...rest }) {
    return rest;
  }
}

module.exports = new ReviewsService();
