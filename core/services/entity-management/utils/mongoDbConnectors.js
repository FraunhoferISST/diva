const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const { DIVA_DB_NAME, collectionsNames } = require("./constants");

const mongoDBConnector = new MongoDBConnector(
  DIVA_DB_NAME,
  Object.values(collectionsNames)
);

module.exports = {
  mongoDBConnector,
};
