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
  entityTypes: { SCHEMA, SYSTEM_ENTITY },
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
    .sync(`${systemEntitiesPath}/jsonSchemata/**/*.*`)
    .map((path) => JSON.parse(fs.readFileSync(path).toString()))
    .map((schemaEntity) => ({
      ...schemaEntity,
      entityType: SYSTEM_ENTITY,
      systemEntityType: SCHEMA,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      schema: JSON.stringify(schemaEntity.schema),
    }));
  if (defaultEntities.length === 0) {
    log.warn("Couldn't find default schemata");
    return null;
  }
  if (
    (await mongoDbConnector.collections[SYSTEM_ENTITY_COLLECTION_NAME].count({
      systemEntityType: SCHEMA,
    })) === 0
  ) {
    log.info("Inserting default schemata");
    return mongoDbConnector.collections[
      SYSTEM_ENTITY_COLLECTION_NAME
    ].insertMany(defaultEntities);
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

class SchemataService extends EntityService {
  constructor(
    entityType = SYSTEM_ENTITY,
    collectionName = SYSTEM_ENTITY_COLLECTION_NAME
  ) {
    super(entityType, collectionName);
    this.systemEntityType = SCHEMA;
  }

  async init() {
    await loadDefault();
    return super.init().then(() =>
      this.collection.createIndex(
        { schemaName: 1 },
        {
          unique: true,
          partialFilterExpression: { systemEntityType: this.systemEntityType },
        }
      )
    );
  }

  async get(queryParams) {
    return super.get({
      ...queryParams,
      systemEntityType: this.systemEntityType,
    });
  }

  async getByScope(body = {}) {
    const dbQuery = body?.scope
      ? {
          scope: {
            $elemMatch: {
              key: { $in: Object.keys(body.scope) },
              value: { $in: Object.values(body.scope) },
            },
          },
        }
      : {};
    return super.get(
      {
        pageSize: 1000,
        systemEntityType: this.systemEntityType,
      },
      dbQuery
    );
  }

  async create(systemEntity, actorId) {
    const newSystemEntity = {
      ...systemEntity,
      systemEntityType: this.systemEntityType,
      id: generateUuid(this.systemEntityType),
    };
    return super.create(newSystemEntity, actorId);
  }

  getRootSchema() {
    return this.getSchemaByName("entity");
  }

  async deleteById(id) {
    const systemEntity = await this.getById(id, { fields: "id,name" });
    return (
      // first clean up the DB to avoid possible complete system soft locks (e.g. on network failure during the execution)
      this.collection
        .update({}, { $unset: { [systemEntity.name]: "" } }, { multi: true })
        // finally, safely remove the schema
        .then(() => super.deleteById(id))
    );
  }

  async getSchemaByName(schemaName) {
    const systemEntity = await this.collection.findOne({
      schemaName,
      systemEntityType: this.systemEntityType,
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
        systemEntityType: this.systemEntityType,
        schemaName: { $not: /^entity$/ },
      })
      .toArray();
    for (const schemEntity of schemaEntities) {
      parsedRootSchema = await injectJsonSchema(parsedRootSchema, schemEntity);
    }
    return parsedRootSchema;
  }
}
module.exports = new SchemataService(
  SYSTEM_ENTITY,
  SYSTEM_ENTITY_COLLECTION_NAME
);
