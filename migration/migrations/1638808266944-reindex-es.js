const ElasticsearchConnector = require("../utils/databases/ElasticsearchConnector");
const mappingsMap = require("../utils/mappings.json");
const customESSettings = require("../utils/customESSettings.json");
const { wait } = require("../utils/utils");

const esConnector = new ElasticsearchConnector();

let indices = ["resources", "assets", "users", "reviews", "services"];
indices = indices.map((i) => ({
  source: i,
  temp: `temp_${i}`,
}));

module.exports.up = async () => {
  await esConnector.connect();
  const esClient = esConnector.client;

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
  // console.log("Cool down...");
  // await wait(5000);
  console.log("Well done!");
};
