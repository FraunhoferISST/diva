const ElasticsearchConnector = require("../utils/databases/ElasticsearchConnector");
const {
  resourcesMongoDbConnector,
  resourcesCollectionName,
  assetsMongoDbConnector,
  assetsCollectionName,
  usersMongoDbConnector,
  usersCollectionName,
  reviewsMongoDbConnector,
  reviewsCollectionName,
} = require("../utils/databases/mongoDbConnectors");
const paginator = require("../utils/paginateMongoDBEntities");

const esConnector = new ElasticsearchConnector();

const reindexEntity = async (entityType, mongoDbConnector, collection) => {
  const query = {
    entityType,
  };
  const pageSize = 1000;

  for await (const { pageData } of paginator(
    mongoDbConnector.collections[collection],
    query,
    pageSize,
    { _id: 0 }
  )) {
    for (const entity of pageData) {
      await esConnector.client.index({
        index: collection,
        id: entity.id,
        body: entity,
      });
    }
  }
};
const init = async () => {
  await resourcesMongoDbConnector.connect();
  await usersMongoDbConnector.connect();
  await reviewsMongoDbConnector.connect();
  await assetsMongoDbConnector.connect();
  await esConnector.connect();
};

const close = async () => {
  await resourcesMongoDbConnector.disconnect();
  await usersMongoDbConnector.disconnect();
  await reviewsMongoDbConnector.disconnect();
  await assetsMongoDbConnector.disconnect();
  await esConnector.client.close();
};

module.exports.up = async () => {
  try {
    await init();
    console.log("Reindexing resources...");
    await reindexEntity(
      "resource",
      resourcesMongoDbConnector,
      resourcesCollectionName
    );
    console.log("Reindexing assets...");
    await reindexEntity("asset", assetsMongoDbConnector, assetsCollectionName);
    console.log("Reindexing users...");
    await reindexEntity("user", usersMongoDbConnector, usersCollectionName);
    console.log("Reindexing reviews...");
    await reindexEntity(
      "review",
      reviewsMongoDbConnector,
      reviewsCollectionName
    );
    console.log("Great job!");
  } finally {
    await close();
  }
};
