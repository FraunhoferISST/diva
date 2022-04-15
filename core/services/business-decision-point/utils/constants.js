module.exports = {
  DIVA_DB_NAME: process.env.MONGO_DB_NAME ?? "divaDb",
  collectionsNames: {
    ENTITY_COLLECTION_NAME: "entities",
    SYSTEM_ENTITY_COLLECTION_NAME: "systemEntities",
  },
};
