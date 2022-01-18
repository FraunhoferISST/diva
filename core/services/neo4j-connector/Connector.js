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

  async create(entityType, id) {
    const session = neo4jConnector.client.session();
    return session.run(`CREATE (n:${entityType} {id: '${id}'})`);
  }

  async update(entityType, id) {
    try {
      const session = neo4jConnector.client.session();
      await session.run(`CREATE (n:${entityType} {id: '${id}'})`);
      return true;
    } catch (e) {
      if (e.code === "Neo.ClientError.Schema.ConstraintValidationFailed") {
        return true;
      }
      throw new Error(e);
    }
  }

  async delete(entityType, id) {
    const session = neo4jConnector.client.session();
    return session.run(`MATCH (n:${entityType} {id: '${id}'}) DETACH DELETE n`);
  }
}

module.exports = new Connector();
