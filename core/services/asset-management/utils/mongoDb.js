const chalk = require("chalk");
const { MongoClient, ObjectId } = require("mongodb");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";

const mongoDbName = process.env.MONGO_DB_NAME || "assetsDb";
const mongoCollectionName = process.env.MONGO_COLLECTION_NAME || "assets";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 1000 * 60 * 10,
});

const mongoDb = {
  async connect() {
    await client.connect();

    this.database = client.db(mongoDbName);
    this.assetCollection = this.database.collection(mongoCollectionName);

    console.info(
      chalk.blue(
        `✅ MongoDB ready: Connected to "${mongoCollectionName}" collection in "${mongoDbName}" database 💽`
      )
    );

    this.historyDatabase = client.db(historyDbName);
    this.historyCollection = this.historyDatabase.collection(
      historyCollectionName
    );

    console.info(
      chalk.blue(
        `✅ MongoDB ready: Connected to "${historyCollectionName}" collection in "${historyDbName}" database 💽`
      )
    );
  },

  async disconnect() {
    return client.close();
  },
};

module.exports = {
  mongoDb,
  ObjectId,
};
