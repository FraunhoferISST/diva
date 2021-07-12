const chalk = require("chalk");
const axios = require("axios");
const urljoin = require("url-join");
const Ajv19 = require("ajv/dist/2019");
const addFormats = require("ajv-formats");

const { createError } = require("../errors");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";
const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

let ajv = null;
let historySchema = null;
let validate = null;

const loadSchema = async (uri) =>
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

const loadSchemas = async () => {
  ajv = new Ajv19({ loadSchema });
  addFormats(ajv);

  historySchema = await axios.get(
    urljoin(SCHEMA_REGISTRY_URL, "schemata", HISTORY_ROOT_SCHEMA)
  );

  return new Promise((resolve, reject) => {
    ajv
      .compileAsync(historySchema.data)
      .then((v) => {
        validate = v;
        console.log(`✅ Received all JSON Schemata`);
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

const validateJsonSchema = (asset) => {
  const valid = validate(asset);
  if (!valid) {
    console.warn(validate.errors);
    throw createError({
      type: "SchemaValidation",
      message: `Supplied data for the operation violates "${HISTORY_ROOT_SCHEMA}" schema`,
      code: 406,
      errors: validate.errors,
    });
  }

  return valid;
};

module.exports = {
  validateJsonSchema,
  loadSchemas,
};
