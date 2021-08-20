const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const resourcesDbName = process.env.MONGO_DB_NAME || "resourcesDb";
const resourcesCollectionName =
  process.env.MONGO_COLLECTION_NAME || "resources";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const resourcesMongoDbConnector = new MongoDBConnector(resourcesDbName, [
  resourcesCollectionName,
]);

const historyMongoDbConnector = new MongoDBConnector(historyDbName, [
  historyCollectionName,
]);

module.exports = {
  resourcesMongoDbConnector,
  historyMongoDbConnector,
};
