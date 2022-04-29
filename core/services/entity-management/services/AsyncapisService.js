const generateUuid = require("@diva/common/utils/generateUuid");
const { entityNotFoundError } = require("@diva/common/Error");
const EntityService = require("./EntityService");
const {
  collectionsNames: { SYSTEM_ENTITY_COLLECTION_NAME },
  entityTypes: { SYSTEM_ENTITY },
} = require("../utils/constants");
const { asyncapis } = require("../defaultEntities/index");

class AsyncapisService extends EntityService {
  constructor(entityType, collectionName) {
    super(entityType, {
      collectionName,
      defaultEntities: asyncapis,
    });
    this.systemEntityType = "asyncapi";
  }

  async init() {
    return super.init().then(() =>
      this.collection.createIndex(
        { specName: 1 },
        {
          unique: true,
          partialFilterExpression: { systemEntityType: this.systemEntityType },
        }
      )
    );
  }

  async get(query = {}) {
    return super.get({ ...query, systemEntityType: this.systemEntityType });
  }

  async create(systemEntity, actorId) {
    const newSystemEntity = {
      ...systemEntity,
      systemEntityType: this.systemEntityType,
      id: generateUuid(this.systemEntityType),
    };
    return super.create(newSystemEntity, actorId);
  }

  async getByName(specName) {
    const systemEntity = await this.collection.findOne({
      specName,
      systemEntityType: this.systemEntityType,
    });
    if (systemEntity) {
      return this.sanitizeEntity(systemEntity);
    }
    throw entityNotFoundError;
  }
}
module.exports = new AsyncapisService(
  SYSTEM_ENTITY,
  SYSTEM_ENTITY_COLLECTION_NAME
);
