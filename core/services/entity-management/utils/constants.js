module.exports = {
  DIVA_DB_NAME: process.env.MONGO_DB_NAME ?? "divaDb",
  collectionsNames: {
    ENTITY_COLLECTION_NAME: "entities",
    SYSTEM_ENTITY_COLLECTION_NAME: "systemEntities",
    RESOURCE_COLLECTION_NAME: "resources",
    ASSETS_COLLECTION_NAME: "assets",
    REVIEWS_COLLECTION_NAME: "reviews",
    USERS_COLLECTION_NAME: "users",
    SERVICES_COLLECTION_NAME: "services",
    HISTORIES_COLLECTION_NAME: "histories",
  },
};
