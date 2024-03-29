const _ = require("lodash");
const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");
const generateUuid = require("@diva/common/utils/generateUuid");
const { encodeCursor, decodeCursor } = require("@diva/common/api/cursor");

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

class DataNetworkService {
  async init() {
    await neo4jConnector.connect();
    // await createConstraints();
    this.neo4jClient = neo4jConnector.client;
  }

  async nodeExists(id) {
    const { records } = await executeSession(
      `MATCH (n {entityId: '${id}'}) RETURN n`
    );
    return records.length > 0;
  }

  async createNode(entityId, entityType) {
    if (await this.nodeExists(entityId)) {
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

  async deleteNodeById(id) {
    return executeSession(`MATCH (n {entityId: "${id}"}) DETACH DELETE n`);
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
      .map(([key, value]) =>
        _.isNumber(value) ? `${key}: ${value}` : `${key}: "${value}"`
      )
      .join(", ");

    const query = `MATCH (a {entityId: "${from}"}) MATCH (b {entityId: "${to}"}) MERGE (a)-[:${edgeType} {${edgeProperties}}]-(b)`;
    await executeSession(query);
    return newEdgeId;
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

  count(query) {
    return executeSession(query).then(
      ({ records }) => records[0]?._fields[0] ?? 0
    );
  }

  async getEdges({
    from,
    edgeTypes,
    to = null,
    pageSize = 30,
    cursor = false,
    fromNodeType,
    toNodeType,
    bidirectional = false,
  }) {
    const relationshipTypes = edgeTypes ? `r:${edgeTypes.join("|")}` : "r";
    const relationship = `-[${relationshipTypes}]-${bidirectional ? "" : ">"}`;
    let fromNode = "n";
    let toNode = "m";
    let where = " ";
    let whereFromNodeType = "";
    let whereFromAndTo = "";
    let whereToNodeType = "";

    if (fromNodeType && fromNodeType.length === 1) {
      fromNode += `${fromNodeType ? `:${fromNodeType}` : ""}`;
    }

    fromNode += `${from ? ` { entityId: '${from}' }` : ""}`;

    if (toNodeType && toNodeType.length === 1) {
      toNode += `${toNodeType ? `:${toNodeType}` : ""}`;
    }

    toNode += `${to ? ` { entityId: '${to}' }` : ""}`;

    if (fromNodeType && fromNodeType.length > 1) {
      where = " WHERE";
      whereFromNodeType = ` (${fromNodeType
        .map((t) => `n:${t}`)
        .join(" OR ")})`;
    }

    if (toNodeType && toNodeType.length > 1) {
      where = " WHERE";
      whereToNodeType = ` (${toNodeType.map((t) => `m:${t}`).join(" OR ")})`;
    }

    if (whereFromNodeType !== "" && whereToNodeType !== "") {
      whereFromAndTo = " AND";
    }

    where += whereFromNodeType;
    where += whereFromAndTo;
    where += whereToNodeType;

    let limitStr = pageSize < 0 ? "" : `LIMIT ${pageSize}`;
    let page = 1;
    let limit = pageSize;
    const count = await this.count(
      `MATCH (${fromNode}) ${relationship} (${toNode}) ${where} RETURN count(r)`
    );
    if (cursor && count > pageSize) {
      const decodedCursor = JSON.parse(decodeCursor(cursor));
      page = decodedCursor.page;
      limit = decodedCursor.pageSize;
      limitStr = `SKIP ${(page - 1) * limit} LIMIT ${limit}`;
    }

    return executeSession(
      `MATCH (${fromNode}) ${relationship} (${toNode}) RETURN startNode(r) as from, r, endNode(r) as to ${limitStr}`
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
      total: count,
      cursor:
        page * limit < count
          ? encodeCursor(
              JSON.stringify({
                page: page + 1,
                pageSize: limit,
              })
            )
          : null,
    }));
  }

  async edgeExists(from, to, edgeType, bidirectional = false) {
    const relationship = `-[r:${edgeType}]-${bidirectional ? "" : ">"}`;
    const { records } = await executeSession(
      `MATCH (from {entityId: "${from}"}) ${relationship} (to {entityId: "${to}"}) RETURN r`
    );
    return records.length > 0;
  }

  async patchEdgeById(id, patch) {
    const existingEdge = await this.getEdgeById(id);
    const edgeProperties = Object.entries(
      cleanUpProperties({
        ...existingEdge.properties,
        ...patch,
        id: existingEdge.properties.id,
      })
    )
      .map(([key, value]) =>
        _.isNumber(value) ? `${key}: ${value}` : `${key}: "${value}"`
      )
      .join(", ");

    return executeSession(
      `MATCH ()-[r {id: "${id}"}]-() SET r = {${edgeProperties}}`
    );
  }

  async deleteEdgeById(id) {
    return executeSession(`MATCH ()-[r {id: "${id}"}]-() DELETE r`);
  }
}

module.exports = new DataNetworkService();
