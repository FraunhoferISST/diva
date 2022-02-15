const { MongoClient, ObjectId } = require("mongodb");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";
const DIVA_DB_NAME = process.env.DIVA_DB_NAME || "divaDb";
const ENTITY_COLLECTION_NAME = process.env.ENTITY_COLLECTION_NAME || "entities";

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

const analyze = async () => {
  const mongoDbConnector = new MongoDBConnector(DIVA_DB_NAME, [
    ENTITY_COLLECTION_NAME,
  ]);
  await mongoDbConnector.connect();
  const collection = mongoDbConnector.collections[ENTITY_COLLECTION_NAME];
  const resultSet = await collection.updateMany(
    {
      entityToBeArchivedDate: {
        $exists: true,
        $lte: new Date().toISOString(),
      },
      $or: [
        {
          isArchived: {
            $exists: false,
          },
        },
        {
          isArchived: false,
        },
      ],
    },
    {
      $unset: {
        entityToBeArchivedDate: "",
      },
      $set: {
        isArchived: true,
      },
    }
  );
  console.log(resultSet);
  return true;
};

analyze()
  .then(() => console.log("success"))
  .catch((e) => console.error(e));
