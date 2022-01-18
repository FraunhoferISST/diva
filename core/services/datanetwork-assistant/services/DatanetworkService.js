const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");
const { KAFKA_CONSUMER_TOPICS } = require("../utils/constants");
const { nodeNotFoundError } = require("../utils/errors");

const neo4jConnector = new Neo4jConnector();

const createConstraints = async (neo4jLabels) => {
  const constraints = neo4jLabels.map((l) => {
    const session = neo4jConnector.client.session();
    return session.run(
      `CREATE CONSTRAINT unique_${l}_id IF NOT EXISTS ON (a:${l}) ASSERT a.id IS UNIQUE`
    );
  });
  return Promise.all(constraints);
};

const executeSession = (query) => {
  const session = neo4jConnector.client.session();
  return session.run(query).finally(() => session.close());
};

class DatanetworkService {
  async init() {
    await neo4jConnector.connect();
    await createConstraints(KAFKA_CONSUMER_TOPICS.map((t) => t.split(".")[0]));
    this.neo4jClient = neo4jConnector.client;
  }

  async createNode(id, entityType) {
    return executeSession(`CREATE (n:${entityType} {id: '${id}'})`);
  }

  async nodeExists(id) {
    const { records } = await executeSession(
      `MATCH (n {id: '${id}'}) RETURN n`
    );
    return records.length > 0;
  }

  async getNode(id) {
    const { records } = await executeSession(
      `MATCH (n {id: '${id}'}) RETURN n`
    );
    if (records?.length === 0) {
      throw nodeNotFoundError;
    }
    return records[0]?._fields[0].properties;
  }

  async updateNode(id, entityType) {
    return executeSession(`CREATE (n:${entityType} {id: '${id}'})`).catch(
      (e) => {
        if (e?.code === "Neo.ClientError.Schema.ConstraintValidationFailed") {
          return true;
        }
        throw e;
      }
    );
  }

  async deleteNode(id, entityType) {
    return executeSession(
      `MATCH (n:${entityType} {id: '${id}'}) DETACH DELETE n`
    );
  }

  async getEdges({ from, types }, bidirectional = false) {
    const relationshipTypes = types ? `r:${types.join("|")}` : "r";
    const relationship = `-[${relationshipTypes}]-${bidirectional ? "" : ">"}`;
    return executeSession(
      `MATCH (from {id: '${from}'})${relationship}(to) RETURN to, r`
    ).then(({ records }) => ({
      collection:
        records?.map(({ _fields }) => ({
          ..._fields[0].properties,
          relationType: _fields[1].type,
        })) ?? [],
      total: 0,
      cursor: "",
    }));
  }

  async createEdge({ from, to, type }) {
    return executeSession(
      `MATCH (a {id: '${from}'}) MATCH (b {id: '${to}'}) MERGE(a)-[:${type}]-(b)`
    );
  }

  async deleteEdge({ from, to, type }) {
    return executeSession(
      `MATCH (a {id: '${from}'})-[r:${type}]->(b {id: '${to}'}) DELETE r`
    );
  }
}

module.exports = new DatanetworkService();
