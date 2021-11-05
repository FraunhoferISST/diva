const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const resourceDbName = process.env.MONGO_RESOURCES_DB_NAME || "resourcesDb";
const resourceCollectionName =
  process.env.MONGO_RESOURCES_COLLECTION_NAME || "resources";
const dscDbName = process.env.MONGO_DSC_DB_NAME || "dscAdapterDb";
const dscOffersCollectionName =
  process.env.MONGO_DSC_OFFERS_COLLECTION_NAME || "uuidToOfferMappings";
const dscCatalogsCollectionName =
  process.env.MONGO_DSC_CATALOGS_COLLECTION_NAME || "catalogs";

const mongoResourcesConnector = new MongoDBConnector(resourceDbName, [
  resourceCollectionName,
]);

const mongoDscConnector = new MongoDBConnector(dscDbName, [
  dscOffersCollectionName,
  dscCatalogsCollectionName,
]);

module.exports = {
  mongoResourcesConnector,
  mongoDscConnector,
  dscCatalogsCollectionName,
  dscOffersCollectionName,
  resourceCollectionName,
};
