const MongoDBConnector = require("@diva/common/MongoDBConnector");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";

const reviewsDbName = process.env.MONGO_DB_NAME || "reviewsDb";
const reviewsCollectionName = process.env.MONGO_COLLECTION_NAME || "reviews";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const reviewsMongoDbConnector = new MongoDBConnector(mongoURI, reviewsDbName, [
  reviewsCollectionName,
]);

const historyMongoDbConnector = new MongoDBConnector(mongoURI, historyDbName, [
  historyCollectionName,
]);

module.exports = {
  reviewsMongoDbConnector,
  historyMongoDbConnector,
};
