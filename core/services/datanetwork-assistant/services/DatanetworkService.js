const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");
const generateUuid = require("@diva/common/generateUuid");
const { KAFKA_CONSUMER_TOPICS } = require("../utils/constants");
const { nodeNotFoundError, edgeNotFoundError } = require("../utils/errors");

const neo4jConnector = new Neo4jConnector();

const executeSession = (query) => {
  const session = neo4jConnector.client.session();
  return session.run(query).finally(() => session.close());
};

const createConstraints = async (neo4jLabels) => {
  const constraints = neo4jLabels.map((l) =>
    executeSession(
      `CREATE CONSTRAINT unique_${l}_id IF NOT EXISTS ON (a:${l}) ASSERT a.id IS UNIQUE`
    )
  );
  return Promise.all(constraints);
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

  async getEdge(id) {
    const { records } = await executeSession(
      `MATCH (a)-[r {id: "${id}"}]-(b) RETURN a,r,b`
    );
    if (records.length > 0) {
      const record = records[0];
      return Object.fromEntries(
        Object.entries(records[0]._fieldLookup).map(([k, v]) => [
          k,
          { ...record._fields[v].properties, type: record._fields[v].type },
        ])
      );
    }
    throw edgeNotFoundError;
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
          type: _fields[1].type,
        })) ?? [],
      total: 0,
      cursor: "",
    }));
  }

  async createEdge({ from, to, type }) {
    const newEdgeId = generateUuid("edge");
    await executeSession(
      `MATCH (a {id: '${from}'}) MATCH (b {id: '${to}'}) MERGE(a)-[:${type} {id: "${newEdgeId}"}]-(b)`
    );
    return newEdgeId;
  }

  async deleteEdge({ from, to, type }) {
    return executeSession(
      `MATCH (a {id: '${from}'})-[r:${type}]->(b {id: '${to}'}) DELETE r`
    );
  }
}

module.exports = new DatanetworkService();
