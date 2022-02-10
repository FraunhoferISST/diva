const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const dbName = "divaDb";
const collectionName = "uuidToHashMappings";

const mongoDbConnector = new MongoDBConnector(dbName, [collectionName]);

module.exports = {
  mongoDbConnector,
  collectionName,
};
