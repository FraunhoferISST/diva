const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");

const neo4jConnector = new Neo4jConnector();

class DatanetworkService {
  async init() {
    neo4jConnector.connect();
  }

  async getEdges(entityId, actorId) {
    const session = neo4jConnector.client.session();
    try {
      return session.run(`MATCH (a {id: '${entityId}'})-[r]-(b) RETURN a,r,b`);
    } catch (e) {
      throw new Error(e);
    }
  }

  async putEdge({ from, to, type }, actorId) {
    const session = neo4jConnector.client.session();
    try {
      return session.run(
        `MATCH (a {id: '${from}'}) MATCH (b {id: '${to}'}) MERGE(a)-[:${type}]->(b)`
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteEdge({ from, to, type }, actorId) {
    const session = neo4jConnector.client.session();
    try {
      return session.run(
        `MATCH (a {id: '${from}'})-[r:${type}]->(b {id: '${to}'}) DELETE r`
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new DatanetworkService();
