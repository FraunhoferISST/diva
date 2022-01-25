const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");
const generateUuid = require("@diva/common/generateUuid");
const { KAFKA_CONSUMER_TOPICS } = require("../utils/constants");
const {
  nodeNotFoundError,
  edgeNotFoundError,
  edgeAlreadyExistsError,
} = require("../utils/errors");

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

  async deleteNode(id) {
    return executeSession(`MATCH (n {id: "${id}"}) DETACH DELETE n`);
  }

  async getEdgeById(id) {
    const { records } = await executeSession(
      `MATCH (from)-[r {id: "${id}"}]-(to) RETURN from,r,to`
    );
    if (records.length > 0) {
      const record = records[0];
      const fromAndToEntities = Object.fromEntries(
        Object.entries(records[0]._fieldLookup)
          .filter(([k]) => k !== "r")
          .map(([k, v]) => [k, { ...record._fields[v].properties }])
      );
      return {
        ...fromAndToEntities,
        edgeType: record._fields[records[0]._fieldLookup.r].type,
        id: record._fields[records[0]._fieldLookup.r].properties.id,
      };
    }
    throw edgeNotFoundError;
  }

  async getEdges({ from, edgeTypes }, bidirectional = false) {
    const relationshipTypes = edgeTypes ? `r:${edgeTypes.join("|")}` : "r";
    const relationship = `-[${relationshipTypes}]-${bidirectional ? "" : ">"}`;
    return executeSession(
      `MATCH (from {id: '${from}'})${relationship}(to) RETURN to, r`
    ).then(({ records }) => ({
      collection:
        records?.map(({ _fields }) => ({
          from: { id: from },
          to: _fields[0].properties,
          edgeType: _fields[1].type,
          id: _fields[1].properties.id,
        })) ?? [],
      total: 0,
      cursor: "",
    }));
  }

  async edgeExists(from, to, edgeType) {
    const { records } = await executeSession(
      `MATCH (from {id: "${from}"}) -[r: ${edgeType}]- (to {id: "${to}"}) RETURN r`
    );
    return records.length > 0;
  }

  async createEdge({ from, to, edgeType }) {
    if (await this.edgeExists(from, to, edgeType)) {
      throw edgeAlreadyExistsError;
    }
    const newEdgeId = generateUuid("edge");
    await executeSession(
      `MATCH (a {id: '${from}'}) MATCH (b {id: '${to}'}) MERGE(a)-[:${edgeType} {id: "${newEdgeId}"}]-(b)`
    );
    return newEdgeId;
  }

  async deleteEdgeById(id) {
    return executeSession(`MATCH ()-[r {id: "${id}"}]-() DELETE r`);
  }
}

module.exports = new DatanetworkService();
