const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const assetsDbName = process.env.MONGO_DB_NAME || "assetsDb";
const assetsCollectionName = process.env.MONGO_COLLECTION_NAME || "assets";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const assetsMongoDbConnector = new MongoDBConnector(assetsDbName, [
  assetsCollectionName,
]);

const historyMongoDbConnector = new MongoDBConnector(historyDbName, [
  historyCollectionName,
]);

module.exports = {
  assetsMongoDbConnector,
  historyMongoDbConnector,
};
