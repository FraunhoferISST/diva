const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const servicesDbName = process.env.MONGO_DB_NAME || "servicesDb";
const servicesCollectionName = process.env.MONGO_COLLECTION_NAME || "services";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const servicesMongoDbConnector = new MongoDBConnector(servicesDbName, [
  servicesCollectionName,
]);

const historyMongoDbConnector = new MongoDBConnector(historyDbName, [
  historyCollectionName,
]);

module.exports = {
  servicesMongoDbConnector,
  historyMongoDbConnector,
};
