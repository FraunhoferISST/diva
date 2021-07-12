const es = require("./utils/es");
const mongoDb = require("./utils/mongodb");

class Connector {
  async init() {
    es.connect();
    await mongoDb.connect();
  }

  async index({ dbName, collection }, id) {
    const entity = await mongoDb.getEntity(dbName, collection, id);
    return entity
      ? es.client.index({
          index: collection,
          id: entity.id,
          body: entity,
        })
      : true;
  }

  async delete({ collection }, id) {
    try {
      return es.client.delete({
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
