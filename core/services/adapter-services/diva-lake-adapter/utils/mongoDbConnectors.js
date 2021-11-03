const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const dbName = process.env.MONGO_DB_NAME || "divaLakeAdapterDb";
const collectionName =
  process.env.MONGO_COLLECTION_NAME || "uuidToHashMappings";

const objectsMongoDbConnector = new MongoDBConnector(dbName, [collectionName]);

module.exports = {
  objectsMongoDbConnector,
  collectionName,
};
