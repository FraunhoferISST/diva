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

const cleanUpProperties = (properties) => {
  let cleanProperties = {};
  for (const [k, v] of Object.entries(properties)) {
    if (v !== null && v !== undefined)
      if (!Array.isArray(v) && typeof v === "object") {
        if (Object.keys(v).length > 0) {
          cleanProperties = {
            ...cleanProperties,
            ...(Object.keys(cleanUpProperties(v)).length > 0
              ? { [k]: cleanUpProperties(v) }
              : {}),
          };
        }
      } else if (Array.isArray(v)) {
        const cleanArray = v.filter((elem) => elem);
        if (cleanArray.length > 0) {
          cleanProperties[k] = cleanArray;
        }
      } else {
        cleanProperties[k] = v;
      }
  }
  return cleanProperties;
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
        properties: {
          ...record._fields[records[0]._fieldLookup.r].properties,
        },
      };
    }
    throw edgeNotFoundError;
  }

  async getEdges({ from, edgeTypes }, bidirectional = false) {
    const relationshipTypes = edgeTypes ? `r:${edgeTypes.join("|")}` : "r";
    const relationship = `-[${relationshipTypes}]-${bidirectional ? "" : ">"}`;
    return executeSession(
      `MATCH (n {entityId: '${from}'}) ${relationship} (m) RETURN startNode(r) as from, r, endNode(r) as to`
    ).then(({ records }) => ({
      collection:
        records?.map(({ _fields }) => ({
          // preserve TRUE relationship direction
          from: _fields[0].properties,
          to: _fields[2].properties,
          edgeType: _fields[1].type,
          properties: {
            ..._fields[1].properties,
          },
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

  async createEdge({ from, to, edgeType, properties = {} }) {
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
    const edgeProperties = Object.entries({
      ...properties,
      id: newEdgeId,
    })
      .map(([key, value]) => `${key}: "${value}"`)
      .join(", ");

    const query = `MATCH (a {entityId: "${from}"}) MATCH (b {entityId: "${to}"}) MERGE (a)-[:${edgeType} {${edgeProperties}}]-(b)`;
    await executeSession(query);
    return newEdgeId;
  }

  async patchEdgeById(edge, body) {
    if (
      !(await this.edgeExists(
        edge.from.entityId,
        edge.to.entityId,
        edge.edgeType
      ))
    ) {
      throw edgeNotFoundError;
    }
    // merge old properties with new
    const edgeProperties = Object.entries(
      cleanUpProperties({
        ...edge.properties,
        ...body,
        id: edge.properties.id,
      })
    )
      .map(([key, value]) => `${key}: "${value}"`)
      .join(", ");

    return executeSession(
      `MATCH (a {entityId: "${edge.from.entityId}"})-[r]-(b {entityId: "${edge.to.entityId}"}) SET r = {${edgeProperties}}`
    );
  }

  async deleteEdgeById(id) {
    return executeSession(`MATCH ()-[r {id: "${id}"}]-() DELETE r`);
  }
}

module.exports = new DatanetworkService();
