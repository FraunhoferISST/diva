const MongoDbConnectors = require("@diva/common/databases/MongoDBConnector");

const resourceDbName = process.env.MONGO_RESOURCE_DB_NAME || "resourcesDb";
const resourceCollectionName =
  process.env.MONGO_RESOURCE_COLLECTION_NAME || "resources";
const dscDbName = process.env.MONGO_RESOURCE_DB_NAME || "dscAdapterDb";
const dscOffersCollectionName =
  process.env.MONGO_DSC_COLLECTION_NAME || "offers";
const dscCatalogsCollectionName =
  process.env.MONGO_DSC_COLLECTION_NAME || "catalogs";
const dscLegacyCollectionName = process.env.MONGO_DSC_COLLECTION_NAME || "dsc";

const mongoResourcesConnector = new MongoDbConnectors(resourceDbName, [
  resourceCollectionName,
  dscLegacyCollectionName,
]);

const mongoDscConnector = new MongoDbConnectors(dscDbName, [
  dscOffersCollectionName,
  dscCatalogsCollectionName,
]);

module.exports = {
  mongoResourcesConnector,
  mongoDscConnector,
  dscLegacyCollectionName,
  dscCatalogsCollectionName,
  dscOffersCollectionName,
  resourceCollectionName,
};
