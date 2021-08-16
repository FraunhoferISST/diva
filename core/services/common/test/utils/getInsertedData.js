/**
 * Retrieves entities from DB collection inserted through insertMockData. Mostly this is needed once on tests initialization
 * to have test data for uniqueness test on CRUD operations
 * @param {object} request - Request class instance
 * @param {string} collectionName - collection name, e.g. "users", "assets"
 * @return {array} - Array of entities
 */
module.exports = (collectionName, request) =>
  request
    .runRequest(request.makeBaseRequest(`/${collectionName}`))
    .then(({ body: { collection } }) => collection)
    .catch((e) => {
      console.error(e);
    });
