const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");
const generateUuid = require("@diva/common/generateUuid");
const {
  nodeNotFoundError,
  edgeNotFoundError,
  edgeAlreadyExistsError,
  nodeAlreadyExistsError,
} = require("../utils/errors");

const neo4jConnector = new Neo4jConnector();

const executeSession = (query) => {
  const session = neo4jConnector.client.session();
  return session.run(query).finally(() => session.close());
};

const createConstraints = async (
  neo4jLabels = ["resource", "assets", "users", "service", "review"]
) => {
  const constraints = neo4jLabels.map((l) =>
    executeSession(
      `CREATE CONSTRAINT unique_${l}_id IF NOT EXISTS ON (a:${l}) ASSERT a.entityId IS UNIQUE`
    ).catch((e) => {
      if (e.code !== "Neo.ClientError.Schema.IndexWithNameAlreadyExists") {
        throw e;
      }
    })
  );
  return Promise.all(constraints);
};

class DatanetworkService {
  async init() {
    await neo4jConnector.connect();
    await createConstraints();
    this.neo4jClient = neo4jConnector.client;
  }

  async nodeExists(id) {
    const { records } = await executeSession(
      `MATCH (n {entityId: '${id}'}) RETURN n`
    );
    return records.length > 0;
  }

  async createNode(entityId, entityType) {
    if (await this.edgeExists(entityId)) {
      throw nodeAlreadyExistsError;
    }
    return executeSession(
      `CREATE (n:${entityType} {entityId: '${entityId}'})`
    ).then(() => entityId);
  }

  async getNodeById(id) {
    const { records } = await executeSession(
      `MATCH (n {entityId: '${id}'}) RETURN n`
    );
    if (records?.length === 0) {
      throw nodeNotFoundError;
    }
    return records[0]?._fields[0].properties;
  }

  async updateNode(id, entityType) {
    return executeSession(`CREATE (n:${entityType} {entityId: '${id}'})`).catch(
      (e) => {
        if (e?.code === "Neo.ClientError.Schema.ConstraintValidationFailed") {
          return true;
        }
        throw e;
      }
    );
  }

  async deleteNode(id) {
    return executeSession(`MATCH (n {entityId: "${id}"}) DETACH DELETE n`);
  }

  async getEdgeById(id) {
    const { records } = await executeSession(
      `MATCH ()-[r {id: "${id}"}]-() RETURN startNode(r) as from, r, endNode(r) as to`
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

  async getEdges({ from, edgeTypes, to = null }, bidirectional = false) {
    const relationshipTypes = edgeTypes ? `r:${edgeTypes.join("|")}` : "r";
    const relationship = `-[${relationshipTypes}]-${bidirectional ? "" : ">"}`;
    const toNode = `m ${to ? `{ entityId: '${to}' }` : ""}`;
    return executeSession(
      `MATCH (n {entityId: '${from}'}) ${relationship} (${toNode}) RETURN startNode(r) as from, r, endNode(r) as to`
    ).then(({ records }) => ({
      collection:
        records?.map(({ _fields }) => ({
          // preserve TRUE relationship direction
          from: _fields[0].properties,
          to: _fields[2].properties,
          edgeType: _fields[1].type,
          id: _fields[1].properties.id,
        })) ?? [],
      total: 0,
      cursor: "",
    }));
  }

  async edgeExists(from, to, edgeType) {
    const { records } = await executeSession(
      `MATCH (from {entityId: "${from}"}) -[r: ${edgeType}]- (to {entityId: "${to}"}) RETURN r`
    );
    return records.length > 0;
  }

  async createEdge({ from, to, edgeType }) {
    if (await this.edgeExists(from, to, edgeType)) {
      throw edgeAlreadyExistsError;
    }
    if (
      !(await (
        await Promise.all([from, to].map(this.nodeExists))
      ).every((exists) => exists))
    ) {
      throw nodeNotFoundError;
    }
    const newEdgeId = generateUuid("edge");
    await executeSession(
      `MATCH (a {entityId: '${from}'}) MATCH (b {entityId: '${to}'}) MERGE(a)-[:${edgeType} {id: "${newEdgeId}"}]-(b)`
    );
    return newEdgeId;
  }

  async deleteEdgeById(id) {
    return executeSession(`MATCH ()-[r {id: "${id}"}]-() DELETE r`);
  }
}

module.exports = new DatanetworkService();
