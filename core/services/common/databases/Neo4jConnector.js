const neo4j = require("neo4j-driver");
const { logger: log } = require("../logger");

const neo4jURI = process.env.NEO4J_URL || "bolt://localhost:7687";
const neo4jUsername = process.env.NEO4J_ROOT_USERNAME || "neo4j";
const neo4jPassword = process.env.NEO4J_ROOT_PASSWORD || "admin";

class Neo4JConnector {
  constructor(
    URI = neo4jURI,
    Username = neo4jUsername,
    Password = neo4jPassword
  ) {
    this.URI = URI;
    this.Username = Username;
    this.Password = Password;
  }

  async connect() {
    this.client = neo4j.driver(
      neo4jURI,
      neo4j.auth.basic(neo4jUsername, neo4jPassword)
    );
    log.info(`✅ Connected to Neo4J instance "${this.URI}"`);
  }
}

module.exports = Neo4JConnector;
