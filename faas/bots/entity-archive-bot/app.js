const { MongoClient } = require("mongodb");
const axios = require("axios");
const urljoin = require("url-join");
const { serviceId } = require("./package.json");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";
const DIVA_DB_NAME = process.env.DIVA_DB_NAME || "divaDb";
const ENTITY_COLLECTION_NAME = process.env.ENTITY_COLLECTION_NAME || "entities";
const ENTITY_MANAGEMENT_URL =
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000";

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 1000 * 60 * 10,
});

const patchEntity = async (entityId) => {
  try {
    await axios.patch(
      urljoin(
        ENTITY_MANAGEMENT_URL,
        `${entityId.substr(0, entityId.indexOf(":"))}s`,
        entityId
      ),
      {
        entityToBeArchivedDate: null,
        isArchived: true,
      },
      {
        headers: {
          "x-diva": {
            actorId: serviceId,
          },
        },
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

const analyze = async () => {
  console.log("🤖 Entity Archive Bot: I'm booting...");
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
      })
      .project({ _id: 0, id: 1 });

    for await (const entity of cursor) {
      await patchEntity(entity.id);
      console.log(
        `🤖 Entity Archive Bot: I archived entity with id: ${entity.id}`
      );
    }

    return true;
  } catch (err) {
    throw new Error(err);
  } finally {
    client.close();
  }
};

analyze()
  .then(() => {
    console.log("🤖 Entity Archive Bot: I finished successfully!");
  })
  .catch((err) => {
    console.error(err);
  });
