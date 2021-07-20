const { MongoClient, ObjectId } = require("mongodb");
const chalk = require("chalk");

class MongoDBConnector {
  constructor(URI, databaseName, collectionsNames = []) {
    this.URI = URI;
    this.databaseName = databaseName;
    this.collectionsNames = collectionsNames;

    this.client = null;
    this.database = null;
    this.collections = {};
  }

  async connect() {
    this.client = new MongoClient(this.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 1000 * 60 * 10,
    });

    await this.client.connect();
    this.database = this.client.db(this.databaseName);
    const collections = this.collectionsNames.map((c) => [
      c,
      this.database.collection(c),
    ]);
    this.collections = Object.fromEntries(collections);
    console.info(
      chalk.blue(
        `✅ MongoDB ready: Connected to "${this.collectionsNames}" collection in "${this.databaseName}" database 💽`
      )
    );
  }

  async disconnect() {
    return this.client.close();
  }

  toObjectId(string) {
    return ObjectId(string);
  }
}

module.exports = MongoDBConnector;
