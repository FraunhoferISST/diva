const { MongoClient, ObjectId } = require("mongodb");
const chalk = require("chalk");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";

const mongoDbName = process.env.MONGO_DB_NAME || "reviewsDb";
const mongoCollectionName = process.env.MONGO_COLLECTION_NAME || "reviews";

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 1000 * 60 * 10,
});

const db = {
  async connect(dbName = mongoDbName) {
    await client.connect();
    this.database = client.db(dbName);
    this.reviewsCollection = this.database.collection(mongoCollectionName);
    this.reviewsCollection.createIndex(
      { creatorId: 1, belongsTo: 1 },
      { unique: true }
    );
    console.info(
      chalk.blue(
        `✅ MongoDB ready: Connected to "${mongoCollectionName}" collection in "${mongoDbName}" database 💽`
      )
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
