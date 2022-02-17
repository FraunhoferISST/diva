const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const urljoin = require("url-join");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";
const DIVA_DB_NAME = process.env.DIVA_DB_NAME || "divaDb";
const ENTITY_COLLECTION_NAME = process.env.ENTITY_COLLECTION_NAME || "entities";
const ENTITY_MANAGEMENT_URL =
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000";
const serviceId = `faas:uuid:${uuidv4()}`;

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 1000 * 60 * 10,
});

const patchEntity = async (entityId) => {
  const path = `${entityId.substr(0, entityId.indexOf(":"))}s`;
  try {
    await axios.patch(
      urljoin(ENTITY_MANAGEMENT_URL, path, entityId),
      {
        entityToBeArchivedDate: null,
        isArchived: true,
      },
      {
        headers: {
          "x-actorid": serviceId,
        },
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

const analyze = async () => {
  try {
    await client.connect();
    const database = client.db(DIVA_DB_NAME);
    const entityCollection = database.collection(ENTITY_COLLECTION_NAME);

    const cursor = await entityCollection
      .find({
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
      })
      .project({ _id: 0, id: 1 });

    for await (const entity of cursor) {
      await patchEntity(entity.id);
    }

    return true;
  } catch (err) {
    throw new Error(err);
  }
};

analyze()
  .then(() => {
    console.log("success");
  })
  .catch((e) => {
    console.error(e);
  });
