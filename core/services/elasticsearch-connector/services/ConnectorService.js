const ElasticsearchConnector = require("@diva/common/databases/ElasticsearchConnector");
const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");
const buildMappingFromJsonSchema = require("../utils/buildMappingFromJsonSchema");
const esSettings = require("../utils/customSettings.json");
const { sanitizeIndexBody } = require("../utils/sanitize");

const esConnector = new ElasticsearchConnector();
const mongoConnector = new MongoDBConnector("divaDb", ["entities"]);
const neo4jConnector = new Neo4jConnector();

const edgesTypes = ["isCreatorOf", "isDataOwnerOf", "isPartOf"];

const getEntity = (dbName, collection, id) =>
  mongoConnector.client
    .db(dbName)
    .collection(collection)
    .findOne({ id }, { projection: { _id: 0 } });

const executeSession = (query) => {
  const session = neo4jConnector.client.session();
  return session.run(query).finally(() => session.close());
};

const getEdges = async ({ from, types = edgesTypes }, bidirectional = true) => {
  const relationshipTypes = types ? `r:${types.join("|")}` : "r";
  const relationship = `-[${relationshipTypes}]-${bidirectional ? "" : ">"}`;
  return executeSession(
    `MATCH (from {entityId: '${from}'})${relationship}(to) RETURN to, r`
  ).then(
    ({ records }) =>
      records?.map(({ _fields }) => ({
        ..._fields[0].properties,
        type: _fields[1].type,
      })) ?? []
  );
};

const indexExists = async (index) =>
  esConnector.client.indices
    .exists({
      index,
    })
    .then(({ statusCode }) => statusCode < 300);

class ConnectorService {
  constructor() {
    this.isIndexing = false;
  }

  async init() {
    await esConnector.connect();
    await neo4jConnector.connect();
    if (!(await indexExists("entities"))) {
      await this.createIndex("entities");
    }
    return mongoConnector.connect();
  }

  async index(id, { dbName = "divaDb", collection = "entities" } = {}) {
    let entity = await getEntity(dbName, collection, id);
    if (entity) {
      entity = sanitizeIndexBody(entity);
      // TODO: on each event we currently just reindex the entity with all edges to ged rid of the possible race conditions. This however doesn't scale and may have performance issues!
      for (const type of edgesTypes) {
        entity[type] = [];
      }
      const edges = await getEdges({ from: id }, true);
      for (const edge of edges) {
        entity[edge.type].push(edge.entityId);
      }
      await esConnector.client.index({
        index: collection,
        id: entity.id,
        body: entity,
      });
    }
    return true;
  }

  async delete(id, { collection = "entities" } = {}) {
    try {
      return esConnector.client.delete({
        index: collection,
        id,
      });
    } catch (e) {
      if (e.statusCode === 404) {
        return true;
      }
      throw new Error(e.message);
    }
  }

  async createIndex(index = "entities") {
    const mappings = await buildMappingFromJsonSchema("entity");
    return esConnector.client.indices.create({
      index,
      body: {
        ...esSettings,
        mappings,
      },
    });
  }

  async reindex(schemaId, type, index = "entities") {
    if (type === "create") {
      // request schema from mongo to get property name
      const entity = await getEntity("divaDb", "systemEntities", schemaId);
      // build whole mapping
      const mappings = await buildMappingFromJsonSchema("entity");
      // extract sub mapping and build PUT body
      const subMapping = {
        properties: {
          [entity.schemaName]: mappings.properties[entity.schemaName],
        },
      };
      // send PUT
      return esConnector.client.indices.putMapping({
        index,
        body: subMapping,
      });
    } else if ( type === "delete" ) {
      // TODO
    }
  }
}

module.exports = new ConnectorService();
