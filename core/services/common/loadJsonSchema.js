const axios = require("axios");
const urljoin = require("url-join");
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const path = require("path");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";

const fetchSchema = (schemaName) =>
  axios
    .get(urljoin(SCHEMA_REGISTRY_URL, "schemata", schemaName))
    .then((res) => res.data);

const schemaResolver = {
  order: 1,
  canRead: true,
  async read(file) {
    return fetchSchema(path.basename(file.url));
  },
};

module.exports = async (schemaName) =>
  $RefParser.dereference(schemaName, {
    resolve: { registry: schemaResolver },
  });
