const { MongoClient } = require("mongodb");
const axios = require("axios");
const urljoin = require("url-join");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";
const DIVA_DB_NAME = process.env.DIVA_DB_NAME || "divaDb";
const ENTITY_COLLECTION_NAME = process.env.ENTITY_COLLECTION_NAME || "entities";
const ENTITY_MANAGEMENT_URL =
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000";
const serviceId = "service:uuid:ff98d351-7fe5-433f-bf68-90545c70de6b";
const entityId = process.env.ENTITY_ID;

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 1000 * 60 * 10,
});

const deleteEntity = async (entityId) => {
  try {
    await axios.delete(
      urljoin(
        ENTITY_MANAGEMENT_URL,
        `${entityId.substr(0, entityId.indexOf(":"))}s`,
        entityId
      ),
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
  console.log("🤖 Entity Delete Bot: I'm booting...");
  try {
    await client.connect();
    const database = client.db(DIVA_DB_NAME);
    const entityCollection = database.collection(ENTITY_COLLECTION_NAME);

    const cursor = await entityCollection
      .find({
        entityToBeDeletedDate: {
          $exists: true,
          $lte: new Date().toISOString(),
        },
      })
      .project({ _id: 0, id: 1 });

    for await (const entity of cursor) {
      await deleteEntity(entity.id);
      console.log(
        `🤖 Entity Delete Bot: I deleted entity with id: ${entity.id}`
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
    console.log("🤖 Entity Delete Bot: I finished successfully!");
  })
  .catch((err) => {
    console.error(err);
  });
