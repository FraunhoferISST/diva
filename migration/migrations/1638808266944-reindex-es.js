const ElasticsearchConnector = require("../utils/databases/ElasticsearchConnector");
const mappingsMap = require("../utils/mappings.json");
const customESSettings = require("../utils/customESSettings.json");

const esConnector = new ElasticsearchConnector();

let indices = ["resources", "assets", "users", "reviews", "services"];
indices = indices.map((i) => ({
  source: i,
  temp: `temp_${i}`,
}));

module.exports.up = async () => {
  await esConnector.connect();
  const esClient = esConnector.client;

  // just clean up

  console.log("Cleaning up temp indices...");

  for (const index of indices) {
    await esClient.indices.delete({
      index: index.temp,
      ignore_unavailable: true,
    });
  }

  console.log("Moving indices to temp indices...");

  for (const index of indices) {
    await esClient.reindex({
      waitForCompletion: true,
      refresh: true,
      body: {
        source: {
          index: index.source,
        },
        dest: {
          index: index.temp,
        },
      },
    });
  }

  console.log("Deleting indices...");

  for (const index of indices) {
    await esClient.indices.delete({
      index: index.source,
      ignore_unavailable: true,
    });
  }

  console.log("Recreating indices with new mappings...");

  for (const index of indices) {
    await esClient.indices.create({
      index: index.source,
      body: { ...customESSettings, ...mappingsMap[index.source] },
    });
  }

  console.log("Moving data from temp to new indices...");
  // copy reviews, users, services back, assets and resources will be reindex after licenses migration
  for (const index of indices.filter(
    (i) => !["resources", "assets"].includes(i.source)
  )) {
    const { body } = await esClient.indices.exists({
      index: index.temp,
    });
    if (body) {
      await esClient.reindex({
        waitForCompletion: true,
        refresh: true,
        body: {
          source: {
            index: index.temp,
          },
          dest: {
            index: index.source,
          },
        },
      });
    }
  }

  console.log("Cleaning up temp indices...");

  for (const index of indices) {
    await esClient.indices.delete({
      index: index.temp,
      ignore_unavailable: true,
    });
  }
  console.log("Well done!");
};
