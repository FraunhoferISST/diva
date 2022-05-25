const nodePath = require("path");
const glob = require("glob");
const fs = require("fs");
const rules = require("./rules/rules");
const policies = require("./policies/policies");
const services = require("./services/services");
const {
  entityTypes: { SCHEMA, SYSTEM_ENTITY, ASYNCAPI, RULE, POLICY, SERVICE },
} = require("../utils/constants");

let WORK_DIR = process.cwd();
const systemEntitiesDir = "defaultEntities";
let systemEntitiesPath = nodePath.join(WORK_DIR, systemEntitiesDir);

if (process.pkg?.entrypoint) {
  const pkgEntryPoint = process.pkg?.entrypoint ?? "";
  WORK_DIR = pkgEntryPoint.substring(0, pkgEntryPoint.lastIndexOf("/") + 1);
  systemEntitiesPath = nodePath.join(WORK_DIR, systemEntitiesDir);
}

const getEntityBasicData = () => ({
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
});

const schemata = glob
  .sync(`${systemEntitiesPath}/jsonSchemata/**/*.*`)
  .map((path) => JSON.parse(fs.readFileSync(path).toString()))
  .map((schemaEntity) => ({
    ...schemaEntity,
    entityType: SYSTEM_ENTITY,
    systemEntityType: SCHEMA,
    schema: JSON.stringify(schemaEntity.schema),
    ...getEntityBasicData(),
  }));
const asyncapisIds = [
  "asyncapi:uuid:0714f37a-ed21-4631-b8fb-80ef65818d12",
  "asyncapi:uuid:c6a88f62-fe8e-46d8-a1ed-1856a351f1d3",
  "asyncapi:uuid:d8083e37-3a59-4a92-909d-d2e83dbac879",
];
const asyncapis = glob
  .sync(`${systemEntitiesPath}/asyncapi/**/*.*`)
  .map((path, i) => ({
    specName: nodePath.parse(path).name,
    title: nodePath.parse(path).name,
    asyncapi: fs.readFileSync(path).toString(),
    systemEntityType: ASYNCAPI,
    id: asyncapisIds[i],
    entityType: SYSTEM_ENTITY,
    ...getEntityBasicData(),
  }));

// we need to stringify mongo condition because of "$" character
const prepareCondition = (condition) =>
  condition === true
    ? condition
    : Object.fromEntries(
        Object.entries(condition).map(([modifier, v]) => [
          modifier,
          v.map((subCondition) => {
            const dbType = Object.keys(subCondition)[0];
            const { query } = subCondition[dbType];
            return {
              [dbType]: {
                ...subCondition[dbType],
                query: dbType === "mongo" ? JSON.stringify(query) : query,
              },
            };
          }),
        ])
      );

module.exports = {
  rules: rules.map((rule) => ({
    ...rule,
    entityType: SYSTEM_ENTITY,
    systemEntityType: RULE,
    condition: prepareCondition(rule.condition),
    ...getEntityBasicData(),
  })),
  policies: policies.map((policy) => ({
    ...policy,
    entityType: SYSTEM_ENTITY,
    systemEntityType: POLICY,
    ...getEntityBasicData(),
    condition: prepareCondition(policy.condition),
  })),
  schemata,
  asyncapis,
  services: services.map((service) => ({
    ...service,
    entityType: SERVICE,
    ...getEntityBasicData(),
  })),
};
