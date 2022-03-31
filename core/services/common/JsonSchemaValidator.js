const axios = require("axios");
const urljoin = require("url-join");
const Ajv19 = require("ajv/dist/2019");
const addFormats = require("ajv-formats");
const { createError } = require("./Error");
const { logger: log } = require("./logger");
const { serviceInstanceId } = require("./utils/serviceInstanceId");

const SCHEMA_URL = process.env.SCHEMA_URL || "http://localhost:3000";

const fetchSchema = (schemaName) =>
  axios.get(
    urljoin(SCHEMA_URL, "systemEntities/resolvedSchemata", schemaName),
    {
      headers: { "x-actorid": serviceInstanceId },
    }
  );

const compileValidator = async (schema) => {
  let schemaObject = null;
  if (typeof schema === "string") {
    schemaObject = await fetchSchema(schema);
  }
  const ajv = new Ajv19({ strict: false });
  addFormats(ajv);
  return ajv.compile(schemaObject ?? schema);
};

const validateJsonSchema = (schemaName, data, validator) => {
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
    return validateJsonSchema(schemaName, data, validator);
  }
}

module.exports = new JsonSchemaValidator();
