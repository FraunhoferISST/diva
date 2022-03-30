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

const defaultPolicies = require("../defaultSystemEntities/policies/policies");
const defaultRules = require("../defaultSystemEntities/rules/rules");

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
      name: nodePath.parse(path).name,
      title: nodePath.parse(path).name,
      schema: fs.readFileSync(path).toString(),
      systemEntityType: "schema",
    }));
  const policies = defaultPolicies.map((p) => ({
    ...p,
    systemEntityType: "policy",
  }));
  const rules = defaultRules.map((r) => ({
    ...r,
    systemEntityType: "rule",
  }));
  const asyncApi = glob
    .sync(`${systemEntitiesPath}/asyncapi/**/*.*`)
    .map((path) => ({
      name: nodePath.parse(path).name,
      title: nodePath.parse(path).name,
      asyncapi: fs.readFileSync(path).toString(),
      systemEntityType: "asyncapi",
    }));
  const defaultEntities = [...jsonSchemas, ...policies, ...rules, ...asyncApi];
  if (defaultEntities.length === 0) {
    log.warn("Couldn't find default system entities");
    return null;
  }
  const entities = defaultEntities.map((e) => ({
    ...e,
    id: generateUuid(e.systemEntityType),
    entityType: "systemEntity",
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  }));
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

  async create(systemEntity, actorId) {
    if (systemEntity.systemEntityType === "schema") {
      const { id: rootSchemaId, schema } = await this.getRootSchema();
      const parsedRootSchema = JSON.parse(schema);
      parsedRootSchema.allOf.push({
        if: {
          required: [systemEntity.scope.key],
          properties: {
            [systemEntity.scope.key]: { const: [systemEntity.scope.value] },
          },
        },
        then: {
          $ref: `${systemEntity.name}`,
        },
      });
      const { id, delta } = await super.create(systemEntity, actorId);
      await this.updateById(
        rootSchemaId,
        { schema: JSON.stringify(parsedRootSchema) },
        actorId
      ).catch(async (e) => {
        await this.deleteById(id);
        throw e;
      });
      return { id, delta };
    }
    const { id, delta } = await super.create(systemEntity, actorId);
    return { id, delta };
  }

  getRootSchema() {
    return this.getEntityByName("entity", "schema");
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
    return dereferenceSchema(name, this.getEntityByName.bind(this));
  }
}
module.exports = new SystemEntitiesService(
  "systemEntity",
  SYSTEM_ENTITY_COLLECTION_NAME
);
