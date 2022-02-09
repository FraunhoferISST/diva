/**
 * Retrieves entities from DB collection inserted through insertMockData. Mostly this is needed once on tests initialization
 * to have test data for uniqueness test on CRUD operations
 * @param {object} request - Request class instance
 * @param {string} entityType - entity name, e.g. "user", "asset"
 * @return {array} - Array of entities
 */
module.exports = (entityType, request) =>
  request
    .runRequest(request.makeBaseRequest(`/${entityType}s`))
    .then(({ body: { collection } }) => collection)
    .catch((e) => {
      console.error(e);
    });
