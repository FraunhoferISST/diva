const generateUuid = require("@diva/common/utils/generateUuid");
const EntityService = require("./EntityService");
const {
  collectionsNames: { SYSTEM_ENTITY_COLLECTION_NAME },
  entityTypes: { SYSTEM_ENTITY, RULE },
} = require("../utils/constants");

const { rules } = require("../defaultEntities/index");

class RulesService extends EntityService {
  constructor(
    entityType = SYSTEM_ENTITY,
    collectionName = SYSTEM_ENTITY_COLLECTION_NAME
  ) {
    super(entityType, {
      collectionName,
      defaultEntities: rules,
    });
    this.systemEntityType = RULE;
  }

  async init() {
    return super.init();
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
}
module.exports = new RulesService(SYSTEM_ENTITY, SYSTEM_ENTITY_COLLECTION_NAME);
