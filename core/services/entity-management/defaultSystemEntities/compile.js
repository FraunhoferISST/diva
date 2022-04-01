const fs = require("fs");
const generateUuid = require("@diva/common/utils/generateUuid");

const schema = {};
const root = require("./json-schema/entity.json");

const path =
  "/home/ubuntu/Documents/Projects/diva/core/services/entity-management/defaultSystemEntities/json-schema";

const writeEntities = (entities) => {
  for (const e of entities) {
    if (!e.schemaName) {
      console.log("suka");
    }
    fs.writeFileSync(
      `/home/ubuntu/Documents/Projects/diva/core/services/entity-management/defaultSystemEntities/output/${e.schemaName}.json`,
      JSON.stringify(e, 0, 2)
    );
  }
};

/* const compileSchema = () => {
  const props = schema.properties; // .allOf.filter((block) => block.properties)[0].properties;
  const entities = Object.entries(props).map(([k, v]) => ({
    title: v.title || k,
    name: k,
    description: v.description,
    systemEntityType: "schema",
    entityType: "systemEntity",
    scope: [
      {
        key: "entityType",
        value: "history",
      },
    ],
    schema: {
      $schema: "https://json-schema.org/draft/2019-09/schema",
      type: "object",
      title: v.title,
      properties: {
        [k]: v,
      },
    },
  }));
  writeEntities(entities);
};

const compileRootSchema = () => {
  const props = root.allOf.filter((block) => block.properties)[0].properties;
  const entities = Object.entries(props).map(([k, v]) => ({
    title: v.title,
    name: k,
    description: v.description,
    systemEntityType: "schema",
    entityType: "systemEntity",
    schema: {
      $schema: "https://json-schema.org/draft/2019-09/schema",
      type: "object",
      title: v.title,
      properties: {
        [k]: v,
      },
    },
  }));
  writeEntities(entities);
};

compileSchema();
// compileRootSchema(); */

const schemaEntities = fs.readdirSync(path);

const ee = [];
for (const e of schemaEntities) {
  const schemaE = require(`${path}/${e}`);
  ee.push({
    id: generateUuid("schema"),
    ...schemaE,
    title: schemaE.title || schemaE.schemaName,
  });
}
writeEntities(ee);
