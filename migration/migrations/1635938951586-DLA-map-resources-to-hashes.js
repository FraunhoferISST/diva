const chalk = require("chalk");
const {
  resourcesMongoDbConnector,
  resourcesCollectionName,
  divaLakeMongoDbConnector,
  divaLakeCollectionName,
} = require("../utils/databases/mongoDbConnectors");
const progressBar = require("../utils/progressBar");
const paginator = require("../utils/paginateMongoDBEntities");

const createUuidToHashMappings = async () => {
  const distributionType = "divaLake";
  const query = {
    distributions: { $elemMatch: { type: distributionType } },
  };
  const pageSize = 100;
  const documentsCount = await resourcesMongoDbConnector.collections[
    resourcesCollectionName
  ].countDocuments(query);

  const pb = progressBar.create(documentsCount, 0, {
    title: "Processing resources",
  });

  for await (const { processed, pageData } of paginator(
    resourcesMongoDbConnector.collections[resourcesCollectionName],
    query,
    pageSize
  )) {
    const migrationData = pageData.map(({ id, uniqueFingerprint }) => ({
      resourceId: id,
      fileHashSha256: uniqueFingerprint,
    }));
    await divaLakeMongoDbConnector.collections[
      divaLakeCollectionName
    ].insertMany(migrationData);
    pb?.update(processed);
  }
  pb?.stop();
};
const init = async () => {
  await resourcesMongoDbConnector.connect();
  await divaLakeMongoDbConnector.connect();
};

const close = async () => {
  await resourcesMongoDbConnector.disconnect();
  await divaLakeMongoDbConnector.disconnect();
};

module.exports.up = async () => {
  console.log("");
  console.log(chalk.green("######################################"));
  console.log(chalk.green("# Migrating DLA                      #"));
  console.log(chalk.green("######################################"));
  try {
    await init();
    console.info(
      chalk.green(
        `Creating resources to file hashes mappings in "${divaLakeCollectionName}" collection...`
      )
    );
    await createUuidToHashMappings();
    console.log(chalk.green("######################################"));
    console.log(chalk.green("# Migration done                     #"));
    console.log(chalk.green("######################################"));
  } catch (e) {
    console.error(chalk.red("Migration failed with error!"));
    console.error(e);
    throw e;
  } finally {
    await close();
    console.log("");
  }
};
