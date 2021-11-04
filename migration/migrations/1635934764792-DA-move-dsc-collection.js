const chalk = require("chalk");
const {
  resourcesMongoDbConnector,
  dscLegacyCollectionName,
  dscOffersCollectionName,
  dscCatalogsCollectionName,
  dscMongoDbConnector,
  resourcesCollectionName,
} = require("../utils/databases/mongoDbConnectors");
const progressBar = require("../utils/progressBar");
const paginator = require("../utils/paginateMongoDBEntities");

const hasCollection = async (db, collectionName) => {
  const collectionsList = await db
    .listCollections({ name: collectionName }, { nameOnly: true })
    .toArray();
  console.log("");
  return collectionsList.length > 0;
};

const getLegacyCatalogId = async () => {
  const { catalogId } =
    (await resourcesMongoDbConnector.collections[
      dscLegacyCollectionName
    ].findOne({})) ?? {};
  return catalogId;
};

const hasLegacyDscCollection = async () => {
  const collections = await resourcesMongoDbConnector.database
    .listCollections({
      name: dscLegacyCollectionName,
    })
    .toArray();
  return collections.length > 0;
};

const createUuidToOffersMapping = async () => {
  const query = {
    dsc: { $exists: true },
  };
  const pageSize = 1000;
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
    const migrationData = pageData
      .filter(({ dsc }) => dsc)
      .map(
        ({
          id,
          dsc: {
            offer: {
              offerId,
              representationId,
              ruleId,
              artifactId,
              contractId,
            },
          },
        }) => ({
          resourceId: id,
          offerId,
          representationId,
          ruleId,
          artifactId,
          contractId,
        })
      );
    await dscMongoDbConnector.collections[dscOffersCollectionName].insertMany(
      migrationData
    );
    pb?.update(processed);
  }
  pb?.stop();
};
const init = async () => {
  await resourcesMongoDbConnector.connect();
  await dscMongoDbConnector.connect();
};

const close = async () => {
  await resourcesMongoDbConnector.disconnect();
  await dscMongoDbConnector.disconnect();
};

module.exports.up = async () => {
  try {
    console.log("");
    console.log(chalk.green("######################################"));
    console.log(chalk.green("# Migrating DA                       #"));
    console.log(chalk.green("######################################"));

    await init();
    if (await hasLegacyDscCollection()) {
      const legacyCatalogId = await getLegacyCatalogId();
      console.info(chalk.blue(`Found legacy catalog id "${legacyCatalogId}".`));
      if (
        await hasCollection(
          dscMongoDbConnector.database,
          dscCatalogsCollectionName
        )
      ) {
        console.info(
          chalk.blue(
            `Removing existing catalogs in "${dscCatalogsCollectionName}" collection...`
          )
        );
        await dscMongoDbConnector.database.dropCollection(
          dscCatalogsCollectionName
        );
      }
      console.info(
        chalk.blue(
          `Moving catalog id to "${dscCatalogsCollectionName}" collection...`
        )
      );
      await dscMongoDbConnector.collections[
        dscCatalogsCollectionName
      ].insertOne({
        catalog: legacyCatalogId,
      });
      console.info(
        chalk.green(
          `Removing legacy "${dscLegacyCollectionName}" collection...`
        )
      );
      await resourcesMongoDbConnector.database.dropCollection(
        dscLegacyCollectionName
      );
      console.info(
        chalk.green(
          `Creating resources to offers mappings in "${dscLegacyCollectionName}" collection...`
        )
      );
      await createUuidToOffersMapping();
    } else {
      console.info(chalk.green(`No legacy catalog id found!`));
    }
    console.log(chalk.green("######################################"));
    console.log(chalk.green("# Migration done                     #"));
    console.log(chalk.green("######################################"));
  } catch (e) {
    console.error(chalk.green("Migration failed with error!"));
    console.error(e);
    throw e;
  } finally {
    await close();
    console.log("");
  }
};
// module.exports.up(() => {}).catch(console.error);
