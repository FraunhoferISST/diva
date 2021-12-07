const MongoDBConnector = require("./MongoDBConnector");

const dscDbName = process.env.MONGO_DSC_DB_NAME || "dscAdapterDb";
const dscOffersCollectionName =
  process.env.MONGO_DSC_OFFERS_COLLECTION_NAME || "uuidToOfferMappings";
const dscCatalogsCollectionName =
  process.env.MONGO_DSC_CATALOGS_COLLECTION_NAME || "catalogs";
const dscLegacyCollectionName = process.env.MONGO_DSC_COLLECTION_NAME || "dsc";
const dscMongoDbConnector = new MongoDBConnector(dscDbName, [
  dscOffersCollectionName,
  dscCatalogsCollectionName,
]);

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";
const historyMongoDbConnector = new MongoDBConnector(historyDbName, [
  historyCollectionName,
]);

const assetsDbName = process.env.MONGO_ASSETS_DB_NAME || "assetsDb";
const assetsCollectionName =
  process.env.MONGO_ASSETS_COLLECTION_NAME || "assets";
const assetsMongoDbConnector = new MongoDBConnector(assetsDbName, [
  assetsCollectionName,
]);

const resourcesDbName = process.env.MONGO_RESOURCES_DB_NAME || "resourcesDb";
const resourcesCollectionName =
  process.env.MONGO_RESOURCES_COLLECTION_NAME || "resources";
const resourcesMongoDbConnector = new MongoDBConnector(resourcesDbName, [
  resourcesCollectionName,
  dscLegacyCollectionName,
]);

const divaLakeDbName =
  process.env.MONGO_DIVA_LAKE_ADAPTER_DB_NAME || "divaLakeAdapterDb";
const divaLakeCollectionName =
  process.env.MONGO_DIVA_LAKE_ADAPTER_COLLECTION_NAME || "uuidToHashMappings";
const divaLakeMongoDbConnector = new MongoDBConnector(divaLakeDbName, [
  divaLakeCollectionName,
]);

const usersDbName = process.env.MONGO_DB_NAME || "usersDb";
const usersCollectionName = process.env.MONGO_COLLECTION_NAME || "users";
const usersMongoDbConnector = new MongoDBConnector(usersDbName, [
  usersCollectionName,
]);

const reviewsDbName = process.env.MONGO_DB_NAME || "reviewsDb";
const reviewsCollectionName = process.env.MONGO_COLLECTION_NAME || "reviews";
const reviewsMongoDbConnector = new MongoDBConnector(reviewsDbName, [
  reviewsCollectionName,
]);

const servicesDbName = process.env.MONGO_DB_NAME || "servicesDb";
const servicesCollectionName = process.env.MONGO_COLLECTION_NAME || "services";
const servicesMongoDbConnector = new MongoDBConnector(servicesDbName, [
  servicesCollectionName,
]);

module.exports = {
  assetsMongoDbConnector,
  resourcesMongoDbConnector,
  divaLakeMongoDbConnector,
  dscMongoDbConnector,
  historyMongoDbConnector,
  assetsCollectionName,
  resourcesCollectionName,
  divaLakeCollectionName,
  dscLegacyCollectionName,
  dscOffersCollectionName,
  dscCatalogsCollectionName,
  usersMongoDbConnector,
  usersCollectionName,
  reviewsMongoDbConnector,
  reviewsCollectionName,
  servicesMongoDbConnector,
  servicesCollectionName,
};
