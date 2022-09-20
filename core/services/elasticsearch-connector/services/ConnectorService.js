const ElasticsearchConnector = require("@diva/common/databases/ElasticsearchConnector");
const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");
const buildMappingFromJsonSchema = require("../utils/buildMappingFromJsonSchema");
const esSettings = require("../utils/customSettings.json");
const { sanitizeIndexBody } = require("../utils/sanitize");

const { DIVA_DB_NAME } = require("../utils/constants");

const esConnector = new ElasticsearchConnector();
const mongoConnector = new MongoDBConnector(DIVA_DB_NAME, ["entities"]);
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
      allow_no_indices: false,
    })
    .then(({ statusCode }) => statusCode < 300);

const deleteOrphanIndices = async () => {
  const { body } = await esConnector.client.indices.get({
    index: "entities-*",
    flatSettings: true,
  });
  const indices = [];
  for (const [key] of Object.entries(body)) {
    indices.push(parseInt(key.split("-")[1], 10));
  }
  indices.sort((a, b) => a - b);
  indices.shift();
  indices.forEach((index) => {
    esConnector.client.indices.delete({
      index: `entities-${index}`,
    });
  });
};

class ConnectorService {
  async init() {
    await esConnector.connect();
    await neo4jConnector.connect();
    if (!(await indexExists("entities-*"))) {
      await this.createIndex(`entities-${Date.now()}`);
    }
    await mongoConnector.connect();

    // Check if there is more than one entities index
    // This could happen if service crashed on reindex
    return deleteOrphanIndices();
  }

  async index(
    id,
    { dbName = DIVA_DB_NAME, collection = "entities", index = "entities" } = {}
  ) {
    let entity = await getEntity(dbName, collection, id);
    if (entity) {
      entity = sanitizeIndexBody(entity);
      // On each event we currently just reindex the entity with all edges to ged rid of the possible race conditions.
      // This however doesn't scale and may have performance issues!
      for (const type of edgesTypes) {
        entity[type] = [];
      }
      const edges = await getEdges({ from: id }, true);
      for (const edge of edges) {
        entity[edge.type].push(edge.entityId);
      }
      await esConnector.client.index({
        index,
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
        aliases: {
          entities: {},
        },
      },
    });
  }

  async reindex(schemaId, type, index = "entities") {
    if (type === "create") {
      // request schema from mongo to get property name
      const entity = await getEntity(DIVA_DB_NAME, "systemEntities", schemaId);
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
        index: `${index}-*`,
        body: subMapping,
      });
    }
    if (type === "delete") {
      const indexName = `entities-${Date.now()}`;
      // Create new index with new mappings, settings, alias
      await this.createIndex(indexName);
      // Batch process mongodb entities into new index
      const cursor = mongoConnector.client
        .db(DIVA_DB_NAME)
        .collection("entities")
        .find({}, { projection: { _id: 0, id: 1 } })
        .limit(0);
      cursor.forEach((doc) => {
        // index document
        this.index(doc.id, { index: indexName });
      });
      // Delete old entities index
      const { body } = await esConnector.client.indices.get({
        index: "entities-*",
        flatSettings: true,
      });
      for (const [key] of Object.entries(body)) {
        if (indexName !== key) {
          // eslint-disable-next-line no-await-in-loop
          await esConnector.client.indices.delete({
            index: key,
          });
        }
      }
    }
  }
}

module.exports = new ConnectorService();
