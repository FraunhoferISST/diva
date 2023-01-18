const { MongoClient } = require("mongodb");
const axios = require("axios");
const urljoin = require("url-join");
const { calcHashFromString } = require("./similarityHash");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";
const DIVA_DB_NAME = process.env.DIVA_DB_NAME || "divaDb";
const ENTITY_COLLECTION_NAME = process.env.ENTITY_COLLECTION_NAME || "entities";
const ENTITY_MANAGEMENT_URL =
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000";
const { ENTITY_ID, ACTOR_ID } = process.env;

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 1000 * 60 * 10,
});

const patchEntity = async (entityId, keywordsSimilarityHash) => {
  try {
    await axios.patch(
      urljoin(
        ENTITY_MANAGEMENT_URL,
        `${entityId.slice(0, entityId.indexOf(":"))}s`,
        entityId
      ),
      {
        keywordsSimilarityHash,
      },
      {
        headers: {
          "x-diva": JSON.stringify({
            actorId: ACTOR_ID,
          }),
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

    const result = await entityCollection.findOne(
      {
        id: ENTITY_ID,
      },
      { projection: { _id: 0, keywords: 1 } }
    );

    const keywordsSimilarityHash =
      result.keywords.length > 5
        ? calcHashFromString(
            result.keywords.sort(() => Math.random() - 0.5).join("")
          )
        : null;
    await patchEntity(ENTITY_ID, keywordsSimilarityHash);
    return true;
  } catch (err) {
    throw new Error(err);
  } finally {
    client.close();
  }
};

analyze()
  .then(() => {
    console.log("🎉 Successfully calculated keywords similarity hash!");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
