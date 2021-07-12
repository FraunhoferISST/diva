const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
const chalk = require("chalk");

const mongoURI =
    process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";

const HISTORY_DB_NAME = process.env.HISTORY_DB_NAME || "historiesDb";
const HISTORY_COLLECTION_NAME =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = {
  async connect() {
    await client.connect();
    this.database = client.db(HISTORY_DB_NAME);
    this.historiesCollection = this.database.collection(
      HISTORY_COLLECTION_NAME
    );

    console.info(
      chalk.blue(`✅ Connected to "${HISTORY_DB_NAME}" MongoDB database`)
    );
  },

  async disconnect() {
    return client.close();
  },
};

module.exports = {
  db,
  ObjectId,
};
