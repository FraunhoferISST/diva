const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");

const {
  DIVA_DB_NAME,
  collectionsNames: { ENTITY_COLLECTION_NAME, SYSTEM_ENTITY_COLLECTION_NAME },
} = require("./constants");

const mongoDBConnector = new MongoDBConnector(DIVA_DB_NAME, [
  ENTITY_COLLECTION_NAME,
  SYSTEM_ENTITY_COLLECTION_NAME,
]);
const neo4jConnector = new Neo4jConnector();
module.exports = {
  mongoDBConnector,
  neo4jConnector,
};
