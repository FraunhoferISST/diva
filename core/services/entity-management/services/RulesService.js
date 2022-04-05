const { logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/utils/generateUuid");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const EntityService = require("./EntityService");
const {
  collectionsNames: { SYSTEM_ENTITY_COLLECTION_NAME },
  entityTypes: { SYSTEM_ENTITY, RULE },
} = require("../utils/constants");

const defaultRules = require("../defaultSystemEntities/rules/rules");

const loadDefault = async () => {
  const defaultEntities = defaultRules.map((r) => ({
    ...r,
    systemEntityType: RULE,
    id: generateUuid(RULE),
    entityType: SYSTEM_ENTITY,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  }));
  if (defaultEntities.length === 0) {
    log.warn("Couldn't find default rules");
    return null;
  }
  if (
    (await mongoDbConnector.collections[SYSTEM_ENTITY_COLLECTION_NAME].count({
      systemEntityType: RULE,
    })) === 0
  ) {
    log.info("Inserting default rules");
    return mongoDbConnector.collections[
      SYSTEM_ENTITY_COLLECTION_NAME
    ].insertMany(defaultEntities);
  }
};

class RulesService extends EntityService {
  constructor(
    entityType = SYSTEM_ENTITY,
    collectionName = SYSTEM_ENTITY_COLLECTION_NAME
  ) {
    super(entityType, collectionName);
    this.systemEntityType = RULE;
  }

  async init() {
    return loadDefault();
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
