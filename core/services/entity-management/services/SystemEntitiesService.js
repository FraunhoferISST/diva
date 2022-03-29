const nodePath = require("path");
const glob = require("glob");
const fs = require("fs");
const { logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/generateUuid");
const { entityNotFoundError } = require("@diva/common/Error");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const dereferenceSchema = require("../utils/dereferenceSchema");
const EntityService = require("./EntityService");
const {
  collectionsNames: { SYSTEM_ENTITY_COLLECTION_NAME },
} = require("../utils/constants");

let WORK_DIR = process.cwd();
const systemEntitiesDir = "defaultSystemEntities";
let systemEntitiesPath = nodePath.join(WORK_DIR, systemEntitiesDir);

if (process.pkg?.entrypoint) {
  const pkgEntryPoint = process.pkg?.entrypoint ?? "";
  WORK_DIR = pkgEntryPoint.substring(0, pkgEntryPoint.lastIndexOf("/") + 1);
  systemEntitiesPath = nodePath.join(WORK_DIR, systemEntitiesDir);
}

const loadDefaultSystemEntities = async () => {
  const jsonSchemas = glob
    .sync(`${systemEntitiesPath}/json-schema/**/*.*`)
    .map((path) => ({
      path,
      systemEntityType: "schema",
      contentProp: "schema",
    }));
  const policies = glob
    .sync(`${systemEntitiesPath}/policies/**/*.*`)
    .map((path) => ({
      path,
      systemEntityType: "policy",
      contentProp: "policy",
    }));
  const rules = glob.sync(`${systemEntitiesPath}/rules/**/*.*`).map((path) => ({
    path,
    systemEntityType: "rule",
    contentProp: "rule",
  }));
  const asyncApi = glob
    .sync(`${systemEntitiesPath}/asyncapi/**/*.*`)
    .map((path) => ({
      path,
      systemEntityType: "asyncapi",
      contentProp: "schema",
    }));
  const entitiesPaths = [...jsonSchemas, ...policies, ...rules, ...asyncApi];
  if (entitiesPaths.length === 0) {
    log.warn("Couldn't find default system entities");
    return null;
  }
  const entities = [];
  for (const entity of entitiesPaths) {
    const payload = fs.readFileSync(entity.path).toString();
    entities.push({
      id: generateUuid(entity.systemEntityType),
      name: nodePath.parse(entity.path).name,
      title: nodePath.parse(entity.path).name,
      entityType: "systemEntity",
      systemEntityType: entity.systemEntityType,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      [entity.systemEntityType]:
        entity.systemEntityType === "TEST" ? JSON.parse(payload) : payload,
    });
  }
  return Promise.all(
    entities.map((e) =>
      mongoDbConnector.collections[SYSTEM_ENTITY_COLLECTION_NAME].replaceOne(
        {
          name: e.name,
          systemEntityType: e.systemEntityType,
        },
        e,
        { upsert: true }
      )
    )
  );
};

class SystemEntitiesService extends EntityService {
  async init() {
    await loadDefaultSystemEntities();
    return super.init();
  }

  async getEntityByName(name, systemEntityType) {
    const systemEntity = await this.collection.findOne({
      name,
      ...(systemEntityType ? { systemEntityType } : {}),
    });
    if (systemEntity) {
      return this.sanitizeEntity(systemEntity);
    }
    throw entityNotFoundError;
  }

  async resolveSchemaByName(name) {
    const resolvedSchema = await dereferenceSchema(
      name,
      this.getEntityByName.bind(this)
    );
    return resolvedSchema;
  }
}
module.exports = new SystemEntitiesService(
  "systemEntity",
  SYSTEM_ENTITY_COLLECTION_NAME
);
