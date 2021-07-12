const { MongoClient } = require("mongodb");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongoDb = {
  async connect() {
    await client.connect();
    console.info(`✅ Connected to MongoDB instance "${mongoURI}"`);
  },

  getEntity(dbName, collection, id) {
    return client
      .db(dbName)
      .collection(collection)
      .findOne({ id }, { projection: { _id: 0 } });
  },
};

module.exports = mongoDb;
