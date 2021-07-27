const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const reviewsDbName = process.env.MONGO_DB_NAME || "reviewsDb";
const reviewsCollectionName = process.env.MONGO_COLLECTION_NAME || "reviews";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const reviewsMongoDbConnector = new MongoDBConnector(reviewsDbName, [
  reviewsCollectionName,
]);

const historyMongoDbConnector = new MongoDBConnector(historyDbName, [
  historyCollectionName,
]);

module.exports = {
  reviewsMongoDbConnector,
  historyMongoDbConnector,
};
