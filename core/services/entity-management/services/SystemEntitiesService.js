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
    .sync(`${systemEntitiesPath}/jsonSchemata/**/*.*`)
    .map((path) => JSON.parse(fs.readFileSync(path).toString()))
    .map((schemaEntity) => ({
      ...schemaEntity,
      schema: JSON.stringify(schemaEntity.schema),
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
      schemaName: nodePath.parse(path).name,
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
    id: generateUuid(e.systemEntityType),
    ...e,
    entityType: "systemEntity",
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
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

const injectJsonSchema = async (rootSchema, schemaEntity) => {
  const updatedRootSchema = { ...rootSchema };
  const schemaDefinition = await dereferenceSchema(
    JSON.parse(schemaEntity.schema)
  );
  if (schemaEntity.scope) {
    for (const scope of schemaEntity.scope) {
      updatedRootSchema.allOf.push({
        schemaId: schemaEntity.id,
        if: {
          required: [scope?.key],
          properties: {
            [scope?.key]: {
              const: scope?.value,
            },
          },
        },
        then: {
          ...schemaDefinition,
        },
      });
    }
    return updatedRootSchema;
  }
  updatedRootSchema.allOf.push({
    schemaId: schemaEntity.id,
    ...schemaDefinition,
  });
  return updatedRootSchema;
};

class SystemEntitiesService extends EntityService {
  async init() {
    await loadDefaultSystemEntities();
    return super.init().then(() =>
      this.collection.createIndex(
        { schemaName: 1 },
        {
          unique: true,
          partialFilterExpression: { systemEntityType: "schema" },
        }
      )
    );
  }

  async create(systemEntity, actorId) {
    const newSystemEntity = {
      ...systemEntity,
      id: generateUuid(systemEntity.systemEntityType),
    };
    return super.create(newSystemEntity, actorId);
  }

  getRootSchema() {
    return this.getEntityByName("entity", "schema");
  }

  async deleteById(id) {
    const systemEntity = await this.getById(id, { fields: "id,name" });
    if (id.includes("schema")) {
      return (
        // first clean up the DB to avoid possible complete system soft locks (e.g. on network failure during the execution)
        this.collection
          .update({}, { $unset: { [systemEntity.name]: "" } }, { multi: true })
          // finally, safely remove the schema
          .then(() => super.deleteById(id))
      );
    }
    return super.deleteById(id);
  }

  async getEntityByName(schemaName, systemEntityType) {
    const systemEntity = await this.collection.findOne({
      schemaName,
      ...(systemEntityType ? { systemEntityType } : {}),
    });
    if (systemEntity) {
      return this.sanitizeEntity(systemEntity);
    }
    throw entityNotFoundError;
  }

  async resolveEntitySchema() {
    const { schema: rootSchema } = await this.getRootSchema();
    let parsedRootSchema = JSON.parse(rootSchema);
    const schemaEntities = await this.collection
      .find({
        systemEntityType: "schema",
      })
      .toArray();
    for (const schemEntity of schemaEntities) {
      if (schemEntity.schemaName !== "entity") {
        parsedRootSchema = await injectJsonSchema(
          parsedRootSchema,
          schemEntity
        );
      }
    }
    return parsedRootSchema;
  }
}
module.exports = new SystemEntitiesService(
  "systemEntity",
  SYSTEM_ENTITY_COLLECTION_NAME
);
