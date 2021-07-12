const { MongoClient } = require("mongodb");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";

const mongoResourceDbName = process.env.MONGO_RESOURCE_DB_NAME || "resourcesDb";
const mongoResourceCollectionName =
  process.env.MONGO_RESOURCE_COLLECTION_NAME || "resources";

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongoDb = {
  async connect(dbName = mongoResourceDbName) {
    await client.connect();
    this.database = client.db(dbName);
    this.resourcesCollection = this.database.collection(
      mongoResourceCollectionName
    );
    console.info(
      `✅ MongoDB ready: Connected to "${mongoResourceCollectionName}" collection in "${dbName}" database 💽`
    );
  },

  async disconnect() {
    return client.close();
  },
};

module.exports = {
  mongoDb,
};
