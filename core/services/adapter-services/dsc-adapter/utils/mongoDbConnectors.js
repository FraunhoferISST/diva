const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const resourceDbName = process.env.MONGO_RESOURCE_DB_NAME || "resourcesDb";
const resourceCollectionName =
  process.env.MONGO_RESOURCE_COLLECTION_NAME || "resources";
const dscDbName = process.env.MONGO_RESOURCE_DB_NAME || "dscAdapterDb";
const dscOffersCollectionName =
  process.env.MONGO_DSC_COLLECTION_NAME || "uuidToOfferMappings";
const dscCatalogsCollectionName =
  process.env.MONGO_DSC_COLLECTION_NAME || "catalogs";
const dscLegacyCollectionName = process.env.MONGO_DSC_COLLECTION_NAME || "dsc";

const mongoResourcesConnector = new MongoDBConnector(resourceDbName, [
  resourceCollectionName,
  dscLegacyCollectionName,
]);

const mongoDscConnector = new MongoDBConnector(dscDbName, [
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
