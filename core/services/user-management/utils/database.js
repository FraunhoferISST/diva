const chalk = require("chalk");
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";

const mongoDbName = process.env.MONGO_DB_NAME || "usersDb";
const mongoCollectionName = process.env.MONGO_COLLECTION_NAME || "users";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const MONGO_GFS_USER_IMAGE_BUCKET_NAME =
  process.env.MONGO_GFS_USER_IMAGE_BUCKET_NAME || "userImages";

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 1000 * 60 * 10,
});

const db = {
  async connect(dbName = mongoDbName) {
    await client.connect();
    this.database = client.db(dbName);
    this.usersCollection = this.database.collection(mongoCollectionName);

    this.gfs = new GridFSBucket(this.database, {
      bucketName: MONGO_GFS_USER_IMAGE_BUCKET_NAME,
    });
    this.usersCollection.createIndex({ email: 1 }, { unique: true });

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
  db,
  ObjectId,
};
