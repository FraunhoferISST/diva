const path = require("path");
const { logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/utils/generateUuid");
const messageProducer = require("@diva/common/messaging/MessageProducer");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const EntityService = require("./EntityService");
const {
  collectionsNames: { SYSTEM_ENTITY_COLLECTION_NAME },
  entityTypes: { SYSTEM_ENTITY, POLICY },
} = require("../utils/constants");
const defaultPolicies = require("../defaultSystemEntities/policies/policies");

let WORK_DIR = process.cwd();
if (process.pkg?.entrypoint) {
  const pkgEntryPoint = process.pkg?.entrypoint ?? "";
  WORK_DIR = pkgEntryPoint.substring(0, pkgEntryPoint.lastIndexOf("/") + 1);
}
const { serviceId } = require(path.join(`${WORK_DIR}`, "/package.json"));

const loadDefault = async () => {
  const defaultEntities = defaultPolicies.map((p) => ({
    ...p,
    systemEntityType: POLICY,
    id: generateUuid(POLICY),
    entityType: SYSTEM_ENTITY,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  }));
  if (defaultEntities.length === 0) {
    log.warn("Couldn't find default policies");
    return null;
  }
  if (
    (await mongoDbConnector.collections[SYSTEM_ENTITY_COLLECTION_NAME].count({
      systemEntityType: POLICY,
    })) === 0
  ) {
    log.info("Inserting default policies");
    await mongoDbConnector.collections[
      SYSTEM_ENTITY_COLLECTION_NAME
    ].insertMany(defaultEntities);
    defaultEntities.forEach((policy) => {
      messageProducer.produce(policy.id, serviceId, "create");
    });
    return true;
  }
};

class PoliciesService extends EntityService {
  constructor(
    entityType = SYSTEM_ENTITY,
    collectionName = SYSTEM_ENTITY_COLLECTION_NAME
  ) {
    super(entityType, collectionName);
    this.systemEntityType = POLICY;
  }

  async init() {
    await loadDefault();
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
module.exports = new PoliciesService(
  SYSTEM_ENTITY,
  SYSTEM_ENTITY_COLLECTION_NAME
);
