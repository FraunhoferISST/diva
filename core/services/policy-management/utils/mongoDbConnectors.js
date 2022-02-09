const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const assetsDbName = process.env.MONGO_DB_NAME || "assetsDb";
const assetsCollectionName = process.env.MONGO_COLLECTION_NAME || "assets";

const resourcesDbName = process.env.MONGO_DB_NAME || "resourcesDb";
const resourcesCollectionName = process.env.MONGO_COLLECTION_NAME || "resources";

const assetsMongoDbConnector = new MongoDBConnector(assetsDbName, [
  assetsCollectionName,
]);

const resourcesMongoDbConnector = new MongoDBConnector(resourcesDbName, [
  resourcesCollectionName,
]);

module.exports = {
  assetsMongoDbConnector,
  resourcesMongoDbConnector,
};
