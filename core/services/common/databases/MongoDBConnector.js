const { MongoClient, ObjectId } = require("mongodb");
const { logger: log } = require("../logger");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";

class MongoDBConnector {
  constructor(databaseName = "divaDb", collectionsNames = [], URI = mongoURI) {
    this.URI = URI;
    this.databaseName = databaseName;
    this.collectionsNames = collectionsNames;

    this.client = null;
    this.database = null;
    this.collections = {};
  }

  async connect() {
    if (this.client?.topology.isConnected()) {
      return true;
    }
    this.client = new MongoClient(this.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 1000 * 60 * 10,
    });

    await this.client.connect();
    if (this.databaseName) {
      this.database = this.client.db(this.databaseName);
      const collections = this.collectionsNames.map((c) => [
        c,
        this.database.collection(c),
      ]);
      this.collections = Object.fromEntries(collections);
      log.info(
        `✅ MongoDB ready: Connected to "${this.collectionsNames}" in "${this.databaseName}" database 💽`
      );
    }
    return this.client;
  }

  async disconnect() {
    return this.client.close();
  }

  toObjectId(string) {
    return ObjectId(string);
  }
}

module.exports = MongoDBConnector;
