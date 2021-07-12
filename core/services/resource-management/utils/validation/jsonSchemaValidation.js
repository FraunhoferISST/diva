const chalk = require("chalk");
const axios = require("axios");
const urljoin = require("url-join");
const Ajv19 = require("ajv/dist/2019");
const addFormats = require("ajv-formats");

const { createError } = require("../errors");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";
const RESOURCE_ROOT_SCHEMA = process.env.RESOURCE_ROOT_SCHEMA || "resource";
const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

let validateResource = null;
let validateHistory = null;

const loadSchemaResolver = async (uri) =>
  new Promise((resolve, reject) => {
    axios
      .get(urljoin(SCHEMA_REGISTRY_URL, "schemata", uri))
      .then((res) => resolve(res.data))
      .catch((e) => {
        console.log(uri);
        console.log(e);
        reject(e);
      });
  });

const compileValidator = async (schemaName) => {
  const ajv = new Ajv19({ loadSchema: loadSchemaResolver });
  addFormats(ajv);

  let schema = "";

  if (schemaName === RESOURCE_ROOT_SCHEMA) {
    schema = await axios.get(
      urljoin(SCHEMA_REGISTRY_URL, "schemata", RESOURCE_ROOT_SCHEMA)
    );
  }

  if (schemaName === HISTORY_ROOT_SCHEMA) {
    schema = await axios.get(
      urljoin(SCHEMA_REGISTRY_URL, "schemata", HISTORY_ROOT_SCHEMA)
    );
  }

  return new Promise((resolve, reject) => {
    ajv
      .compileAsync(schema.data)
      .then((v) => {
        if (schemaName === RESOURCE_ROOT_SCHEMA) validateResource = v;
        if (schemaName === HISTORY_ROOT_SCHEMA) validateHistory = v;
        console.log(`✅ Received all JSON Schemata for entity "${schemaName}"`);
        resolve();
      })
      .catch((e) => {
        console.info(
          chalk.blue(
            `🛑 Could not load all needed JSON Schemata. Will exit service...`
          )
        );
        console.error(e);
        reject(e);
      });
  });
};

const loadSchemas = async () =>
  Promise.all([
    compileValidator(RESOURCE_ROOT_SCHEMA),
    compileValidator(HISTORY_ROOT_SCHEMA),
  ]);

const validateJsonSchema = (resource) => {
  const valid = validateResource(resource);
  if (!valid) {
    console.warn(validateResource.errors);
    throw createError({
      type: "SchemaValidation",
      message: `Supplied data for the operation violates "${RESOURCE_ROOT_SCHEMA}" schema`,
      code: 406,
      errors: validateResource.errors,
    });
  }

  return valid;
};

const validateHistorySchema = (history) => {
  const valid = validateHistory(history);
  if (!valid) {
    console.warn(validateHistory.errors);
    throw createError({
      type: "SchemaValidation",
      message: `Generated history data violates "${HISTORY_ROOT_SCHEMA}" schema. Please contact Administrator.`,
      code: 500,
      errors: validateHistory.errors,
    });
  }

  return valid;
};

module.exports = {
  validateJsonSchema,
  validateHistorySchema,
  loadSchemas,
};
