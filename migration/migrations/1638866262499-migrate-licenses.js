const chalk = require("chalk");
const Console = require("console");
const {
  resourcesMongoDbConnector,
  resourcesCollectionName,
  assetsMongoDbConnector,
  assetsCollectionName,
} = require("../utils/databases/mongoDbConnectors");
const paginator = require("../utils/paginateMongoDBEntities");

const migrateEntityLicenses = async (
  entityType,
  mongoDbConnector,
  collection
) => {
  const query = {
    entityType,
    licenses: { $exists: true },
  };
  const pageSize = 1000;

  for await (const { pageData } of paginator(
    mongoDbConnector.collections[collection],
    query,
    pageSize
  )) {
    const migrationData = pageData.map(({ id, licenses }) => ({
      id,
      licenses: licenses ? licenses.map((l) => ({ url: l })) : null,
    }));
    for (const res of migrationData) {
      await mongoDbConnector.collections[collection].update(
        { id: res.id },
        { $set: { licenses: res.licenses } }
      );
    }
  }
};
const init = async () => {
  await resourcesMongoDbConnector.connect();
  await assetsMongoDbConnector.connect();
};

const close = async () => {
  await resourcesMongoDbConnector.disconnect();
  await assetsMongoDbConnector.disconnect();
};

module.exports.up = async () => {
  try {
    await init();
    console.log("Migrating licenses for resources...");
    await migrateEntityLicenses(
      "resource",
      resourcesMongoDbConnector,
      resourcesCollectionName
    );
    console.log("Migrating licenses for assets...");
    await migrateEntityLicenses(
      "asset",
      assetsMongoDbConnector,
      assetsCollectionName
    );
    console.log("All good!");
  } catch (e) {
    console.error(chalk.red("Migration failed with error!"));
    console.error(e);
    throw e;
  } finally {
    await close();
  }
};
