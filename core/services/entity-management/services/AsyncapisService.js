const nodePath = require("path");
const glob = require("glob");
const fs = require("fs");
const { logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/utils/generateUuid");
const { entityNotFoundError } = require("@diva/common/Error");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const EntityService = require("./EntityService");
const {
  collectionsNames: { SYSTEM_ENTITY_COLLECTION_NAME },
  entityTypes: { ASYNCAPI, SYSTEM_ENTITY },
} = require("../utils/constants");

let WORK_DIR = process.cwd();
const systemEntitiesDir = "defaultSystemEntities";
let systemEntitiesPath = nodePath.join(WORK_DIR, systemEntitiesDir);

if (process.pkg?.entrypoint) {
  const pkgEntryPoint = process.pkg?.entrypoint ?? "";
  WORK_DIR = pkgEntryPoint.substring(0, pkgEntryPoint.lastIndexOf("/") + 1);
  systemEntitiesPath = nodePath.join(WORK_DIR, systemEntitiesDir);
}

const loadDefault = async () => {
  const defaultEntities = glob
    .sync(`${systemEntitiesPath}/asyncapi/**/*.*`)
    .map((path) => ({
      specName: nodePath.parse(path).name,
      title: nodePath.parse(path).name,
      asyncapi: fs.readFileSync(path).toString(),
      systemEntityType: ASYNCAPI,
      id: generateUuid(ASYNCAPI),
      entityType: SYSTEM_ENTITY,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    }));
  if (defaultEntities.length === 0) {
    log.warn("Couldn't find default system entities");
    return null;
  }
  if (
    (await mongoDbConnector.collections[SYSTEM_ENTITY_COLLECTION_NAME].count({
      systemEntityType: ASYNCAPI,
    })) === 0
  ) {
    log.info("Inserting default asyncapis");
    return mongoDbConnector.collections[
      SYSTEM_ENTITY_COLLECTION_NAME
    ].insertMany(defaultEntities);
  }
};

class AsyncapisService extends EntityService {
  constructor(entityType, collectionName) {
    super(entityType, collectionName);
    this.systemEntityType = "asyncapi";
  }

  async init() {
    await loadDefault();
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
