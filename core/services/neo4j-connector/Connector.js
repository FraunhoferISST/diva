const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");
const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");

const neo4jConnector = new Neo4jConnector();
const mongoConnector = new MongoDBConnector();

const getEntity = (dbName, collection, id) =>
  mongoConnector.client
    .db(dbName)
    .collection(collection)
    .findOne({ id }, { projection: { _id: 0 } });

class Connector {
  async init() {
    neo4jConnector.connect();
    await mongoConnector.connect();
  }

  // TODO Demo Case!!! Not for production!!!
  async create({ dbName, collection }, id) {
    const session = neo4jConnector.client.session();
    return session.run(`CREATE (n:${collection.slice(0, -1)} {id: '${id}'})`);
  }

  async update() {
    // TODO
  }

  async delete() {
    // TODO
  }
}

module.exports = new Connector();
