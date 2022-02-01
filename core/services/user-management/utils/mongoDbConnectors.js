const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const usersDbName = process.env.MONGO_DB_NAME || "usersDb";
const usersCollectionName = process.env.MONGO_COLLECTION_NAME || "users";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const usersMongoDbConnector = new MongoDBConnector(usersDbName, [
  usersCollectionName,
]);

const historyMongoDbConnector = new MongoDBConnector(historyDbName, [
  historyCollectionName,
]);

module.exports = {
  usersMongoDbConnector,
  historyMongoDbConnector,
  usersCollectionName,
};
