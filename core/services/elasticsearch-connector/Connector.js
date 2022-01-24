const ElasticsearchConnector = require("@diva/common/databases/ElasticsearchConnector");
const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");
const { sanitizeIndexBody } = require("./utils/sanitize");

const esConnector = new ElasticsearchConnector();
const mongoConnector = new MongoDBConnector();
const neo4jConnector = new Neo4jConnector();

const getEntity = (dbName, collection, id) =>
  mongoConnector.client
    .db(dbName)
    .collection(collection)
    .findOne({ id }, { projection: { _id: 0 } });

const executeSession = (query) => {
  const session = neo4jConnector.client.session();
  return session.run(query).finally(() => session.close());
};

const getEdge = async (id) => {
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
};

const indexExists = async (index) =>
  esConnector.client.indices.exists({
    index,
  });

class Connector {
  async init() {
    esConnector.connect();
    await neo4jConnector.connect();
    return mongoConnector.connect();
  }

  async index({ dbName, collection }, id) {
    const entity = sanitizeIndexBody(await getEntity(dbName, collection, id));

    return entity
      ? esConnector.client.index({
          index: collection,
          id: entity.id,
          body: entity,
        })
      : true;
  }

  async delete({ collection }, id) {
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

  async createIndex(index, settings, mappings) {
    const { body } = await indexExists(index);
    if (!body) {
      return esConnector.client.indices.create({
        index,
        body: { ...settings, ...mappings },
      });
    }
    return true;
  }

  async indexEdge(edgeId) {
    const edgeData = await getEdge(edgeId);
    if (edgeData) {
      const response = await esConnector.client.search({
        body: {
          query: {
            terms: {
              _id: [edgeData.a.id, edgeData.b.id],
            },
          },
        },
      });
      const connectedEntities = (response?.body?.hits.hits ?? []).map(
        ({ _source }) => _source
      );
      for (const entity of connectedEntities) {
        await esConnector.client.index({
          index: `${entity.entityType}s`,
          id: entity.id,
          body: {
            ...entity,
            [edgeData.r.type]: [
              ...new Set([
                ...(entity[edgeData.r.type] ?? []),
                edgeData.a.id,
                edgeData.b.id,
              ]),
            ],
          },
        });
      }
    }
  }
}

module.exports = new Connector();
