const axios = require("axios");
const urljoin = require("url-join");
const Ajv19 = require("ajv/dist/2019");
const addFormats = require("ajv-formats");
const path = require("path");
const { createError } = require("./Error");
const { logger: log } = require("./logger");
const { serviceInstanceId } = require("./utils/serviceInstanceId");
const workDir = require("./utils/workDir");

const { serviceId } = require(path.join(`${workDir}`, "/package.json"));

const ENTITY_MANAGEMENT_URL =
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000";

const fetchSchema = (schemaName) =>
  axios.get(urljoin(ENTITY_MANAGEMENT_URL, "resolvedSchemata", schemaName), {
    headers: {
      "x-diva": JSON.stringify({
        actorId: serviceId,
        serviceInstanceId,
      }),
    },
  });

const compileValidator = async (schema) => {
  let schemaObject = null;
  if (typeof schema === "string") {
    schemaObject = await fetchSchema(schema);
  }
  const ajv = new Ajv19({ strict: false });
  addFormats(ajv);
  return ajv.compile(schemaObject ?? schema);
};

const validateData = (schemaName, data, validator) => {
  const valid = validator(data);
  if (!valid) {
    throw createError({
      type: "SchemaValidation",
      message: `Supplied data for the operation violates "${schemaName}" schema`,
      code: 406,
      errors: validator.errors,
    });
  }
  return valid;
};

/**
 * @param schema {Object} - schema definition
 * @returns {Promise<unknown> | boolean}
 */
const validateSchema = (schema) => {
  const ajv = new Ajv19({ strict: false });
  addFormats(ajv);
  const valid = ajv.validateSchema(schema);
  if (!valid) {
    throw createError({
      type: "SchemaValidation",
      message: "The JSON Schema definition is invalid",
      code: 406,
      errors: ajv.errors,
    });
  }
  return valid;
};

class JsonSchemaValidator {
  constructor() {
    this.validators = [];
  }

  /**
   * @param {Object|String[]} rootSchemas - array of schema names or schema objects
   * @returns {Promise<void>}
   */
  async init(rootSchemas) {
    this.validators = Object.fromEntries(
      await Promise.all(
        rootSchemas.map(async (schema) => [
          schema.$id ?? schema,
          await compileValidator(schema),
        ])
      )
    );
    log.info(
      `✅ JSON schema validator ready for schemata ${JSON.stringify(
        rootSchemas.map((s) => s.$id ?? s).join(", ")
      )}`
    );
  }

  validate(schemaName, data) {
    const validator = this.validators[schemaName];
    return validateData(schemaName, data, validator);
  }

  validateSchema(schema) {
    return validateSchema(schema);
  }
}

module.exports = new JsonSchemaValidator();
