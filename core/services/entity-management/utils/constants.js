module.exports = {
  DIVA_DB_NAME: process.env.MONGO_DB_NAME ?? "divaDb",
  collectionNames: {
    ENTITY_COLLECTION_NAME: "entities",
    SYSTEM_COLLECTION_NAME: "systemEntities",
    HISTORIES_COLLECTION_NAME: "histories",
  },
  entities: {
    RESOURCES: {
      type: "resource",
      collection: "entities",
    },
    ASSETS: {
      type: "asset",
      collection: "entities",
    },
    REVIEWS: {
      type: "review",
      collection: "entities",
    },
    USERS: {
      type: "user",
      collection: "entities",
    },
    SERVICES: {
      type: "service",
      collection: "entities",
    },
    HISTORIES: {
      type: "history",
      collection: "histories",
    },
    POLICIES: {
      type: "policy",
      collection: "systemEntities",
    },
  },
};
