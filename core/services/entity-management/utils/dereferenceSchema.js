const $RefParser = require("@apidevtools/json-schema-ref-parser");
const path = require("path");

module.exports = async (schemaName, resolve) =>
  $RefParser.dereference(schemaName, {
    /* resolve: {
      registry: {
        order: 1,
        canRead: true,
        async read(file) {
          const { schema } = await resolve(path.basename(file.url), "schema");
          return schema;
        },
      },
    }, */
    dereference: { circular: false },
  });
