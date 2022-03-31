const nodePath = require("path");
const glob = require("glob");
const fs = require("fs");
const { logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/utils/generateUuid");
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
      title: `${nodePath.parse(path).name} JSON schema`,
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
  if (
    (await mongoDbConnector.collections[
      SYSTEM_ENTITY_COLLECTION_NAME
    ].count()) === 0
  ) {
    log.info("Inserting default system entities");
    return mongoDbConnector.collections[
      SYSTEM_ENTITY_COLLECTION_NAME
    ].insertMany(entities);
  }
};

const re = (rootSchema, newSchemaEntity) => {
  const updatedRootSchema = { ...rootSchema };
  if (newSchemaEntity.scope) {
    updatedRootSchema.allOf.push({
      schemaId: newSchemaEntity.id,
      if: {
        required: [newSchemaEntity.scope?.key],
        properties: {
          [newSchemaEntity.scope?.key]: {
            const: newSchemaEntity.scope?.value,
          },
        },
      },
      then: {
        $ref: `/${newSchemaEntity.name}`,
      },
    });
    return updatedRootSchema;
  }
  updatedRootSchema.allOf.push({
    schemaId: newSchemaEntity.id,
    $ref: `/${newSchemaEntity.name}`,
  });
  return updatedRootSchema;
};
const removeJsonSchema = (rootSchema, removedSchemaEntityId) => {
  const updatedRootSchema = { ...rootSchema };
  const removeSchemaIndex = updatedRootSchema.allOf.findIndex(
    ({ schemaId }) => schemaId === removedSchemaEntityId
  );
  updatedRootSchema.allOf.splice(removeSchemaIndex, 1);
  return updatedRootSchema;
};

class SystemEntitiesService extends EntityService {
  async init() {
    await loadDefaultSystemEntities();
    return super.init();
  }

  async create(systemEntity, actorId) {
    const newSystemEntity = {
      ...systemEntity,
      id: generateUuid(systemEntity.systemEntityType),
    };
    if (newSystemEntity.systemEntityType === "schema") {
      const { id: rootSchemaId, schema } = await this.getRootSchema();
      const updatedRootSchema = re(JSON.parse(schema), newSystemEntity);
      const { id, delta } = await super.create(newSystemEntity, actorId);
      await this.patchById(
        rootSchemaId,
        { schema: JSON.stringify(updatedRootSchema) },
        actorId
      ).catch(async (e) => {
        await this.deleteById(id);
        throw e;
      });
      return { id, delta };
    }
    const { id, delta } = await super.create(newSystemEntity, actorId);
    return { id, delta };
  }

  getRootSchema() {
    return this.getEntityByName("entity", "schema");
  }

  async deleteById(id, actorId) {
    if (id.includes("schema")) {
      const { id: rootSchemaId, schema } = await this.getRootSchema();
      const updatedRootSchema = removeJsonSchema(JSON.parse(schema), id);
      return this.patchById(
        rootSchemaId,
        { schema: JSON.stringify(updatedRootSchema) },
        actorId
      ).then(() => super.deleteById(id));
    }
    return super.deleteById(id);
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
