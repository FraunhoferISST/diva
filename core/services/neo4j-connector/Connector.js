const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");

const neo4jConnector = new Neo4jConnector();

class Connector {
  async init() {
    neo4jConnector.connect();
  }

  async createConstraints(neo4jLabels) {
    const constraints = neo4jLabels.map((l) => {
      const session = neo4jConnector.client.session();
      return session.run(
        `CREATE CONSTRAINT unique_${l}_id IF NOT EXISTS ON (a:${l}) ASSERT a.id IS UNIQUE`
      );
    });
    return Promise.all(constraints);
  }

  async create({ dbName, collection }, id) {
    const session = neo4jConnector.client.session();
    return session.run(`CREATE (n:${collection.slice(0, -1)} {id: '${id}'})`);
  }

  async update() {
    // Currently, we don't need to update nodes in neo4j, as we only store a node type and uuid, which can not change
    return true;
  }

  async delete({ dbName, collection }, id) {
    const session = neo4jConnector.client.session();
    return session.run(
      `MATCH (n:${collection.slice(0, -1)} {id: '${id}'}) DELETE n`
    );
  }
}

module.exports = new Connector();
