const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");

const neo4jConnector = new Neo4jConnector();

class DatanetworkService {
  async init() {
    await neo4jConnector.connect();
    this.neo4jClient = neo4jConnector.client;
  }

  async getEdges({ from, types }, bidirectional = false) {
    const session = neo4jConnector.client.session();
    const relationshipTypes = types ? `r:${types.join("|")}` : "r";
    const relationship = `-[${relationshipTypes}]-${bidirectional ? "" : ">"}`;
    return session
      .run(`MATCH (from {id: '${from}'})${relationship}(to) RETURN to, r`)
      .then(
        ({ records }) =>
          records?.map(({ _fields }) => ({
            ..._fields[0].properties,
            relationType: _fields[1].type,
          })) ?? []
      )
      .finally(() => session.close());
  }

  async putEdge({ from, to, type }) {
    const session = neo4jConnector.client.session();
    return session
      .run(
        `MATCH (a {id: '${from}'}) MATCH (b {id: '${to}'}) MERGE(a)-[:${type}]-(b)`
      )
      .finally(() => session.close());
  }

  async deleteEdge({ from, to, type }) {
    const session = neo4jConnector.client.session();
    return session
      .run(`MATCH (a {id: '${from}'})-[r:${type}]->(b {id: '${to}'}) DELETE r`)
      .finally(() => session.close());
  }
}

module.exports = new DatanetworkService();
