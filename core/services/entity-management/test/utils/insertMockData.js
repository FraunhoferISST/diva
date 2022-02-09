const mockData = require("./mockData");
const Request = require("./Request");

/**
 * Inserts entity mock data in to the data base using the service api. Mostly this is needed once on tests initialization
 * Please note that common CRUD operations tests expect the mock data to be loaded.
 * @param {object} server - running expressServer instance
 * @param {string} entityType - collection name, e.g. "users", "assets"
 */
module.exports = (entityType = "resource", server) => {
  const request = new Request(server);
  const testData = mockData[`${entityType}s`].data;
  return Promise.all(
    testData.map((entity) =>
      request.runRequest(request.makeBodyRequest(`/${entityType}s`, entity))
    )
  )
    .then((responses) => responses.map(({ text }) => text))
    .catch((e) => {
      console.error(e);
    });
};
