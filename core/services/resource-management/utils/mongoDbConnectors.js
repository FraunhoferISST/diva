const MongoDBConnector = require("@diva/common/MongoDBConnector");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";

const resourcesDbName = process.env.MONGO_DB_NAME || "resourcesDb";
const resourcesCollectionName =
  process.env.MONGO_COLLECTION_NAME || "resources";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const resourcesMongoDbConnector = new MongoDBConnector(
  mongoURI,
  resourcesDbName,
  [resourcesCollectionName]
);

const historyMongoDbConnector = new MongoDBConnector(mongoURI, historyDbName, [
  historyCollectionName,
]);

module.exports = {
  resourcesMongoDbConnector,
  historyMongoDbConnector,
};
