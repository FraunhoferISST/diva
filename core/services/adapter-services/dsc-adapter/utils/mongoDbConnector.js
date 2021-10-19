const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const resourceDbName = process.env.MONGO_RESOURCE_DB_NAME || "resourcesDb";
const resourceCollectionName =
  process.env.MONGO_RESOURCE_COLLECTION_NAME || "resources";
const dscCollectionName = process.env.MONGO_DSC_COLLECTION_NAME || "dsc";

const mongoConnector = new MongoDBConnector(resourceDbName, [
  resourceCollectionName,
  dscCollectionName,
]);

module.exports = {
  mongoConnector,
};
