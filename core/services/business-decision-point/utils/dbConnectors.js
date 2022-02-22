const DbConnectors = require("@diva/common/databases/MongoDBConnector");
const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");

const mongoDBConnector = new DbConnectors("divaDb", ["entities"]);
const neo4jConnector = new Neo4jConnector();
module.exports = {
  mongoDBConnector,
  neo4jConnector,
};
