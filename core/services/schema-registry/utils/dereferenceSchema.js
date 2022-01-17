const $RefParser = require("@apidevtools/json-schema-ref-parser");
const path = require("path");
const { getSchemaByName } = require("./inMemoryDb");

const schemaResolver = {
  order: 1,
  canRead: true,
  async read(file) {
    const { payload } = await getSchemaByName(path.basename(file.url));
    return payload;
  },
};

module.exports = async (schemaName) =>
  $RefParser.dereference(schemaName, {
    resolve: { registry: schemaResolver },
  });
