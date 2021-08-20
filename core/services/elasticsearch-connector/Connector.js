const ElasticsearchConnector = require("@diva/common/databases/ElasticsearchConnector");
const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const esConnector = new ElasticsearchConnector();
const mongoConnector = new MongoDBConnector();

const getEntity = (dbName, collection, id) =>
  mongoConnector.client
    .db(dbName)
    .collection(collection)
    .findOne({ id }, { projection: { _id: 0 } });

class Connector {
  async init() {
    esConnector.connect();
    await mongoConnector.connect();
  }

  async index({ dbName, collection }, id) {
    const entity = await getEntity(dbName, collection, id);
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
}

module.exports = new Connector();
