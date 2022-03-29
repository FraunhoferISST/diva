const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const {
  DIVA_DB_NAME,
  collectionsNames: { ENTITY_COLLECTION_NAME, HISTORIES_COLLECTION_NAME },
} = require("./constants");

const mongoDbConnector = new MongoDBConnector(DIVA_DB_NAME, [
  ENTITY_COLLECTION_NAME,
  HISTORIES_COLLECTION_NAME,
]);

module.exports = {
  mongoDbConnector,
};
