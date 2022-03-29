const axios = require("axios");
const urljoin = require("url-join");
const Ajv19 = require("ajv/dist/2019");
const addFormats = require("ajv-formats");
const { createError } = require("./Error");
const { logger: log } = require("./logger");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3000/";

const fetchSchema = (schemaName) =>
  axios.get(urljoin(SCHEMA_REGISTRY_URL, "resolvedSchemata", schemaName));

const compileValidator = (schema) => {
  const ajv = new Ajv19({ strict: false });
  addFormats(ajv);
  return ajv.compile(schema);
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
  async init(rootSchemas = [], rootSchemasNames = []) {
    this.validators = Object.fromEntries(
      rootSchemas.map((schema) => [schema.$id, compileValidator(schema)])
    );
    if (rootSchemasNames.length > 0) {
      this.validators.push(
        ...Object.fromEntries(
          await Promise.all(
            rootSchemasNames.map(async (schemaName) => [
              schemaName,
              compileValidator(await fetchSchema(schemaName)),
            ])
          )
        )
      );
    }
    log.info(
      `✅ JSON schema validator ready for schemata "${JSON.stringify(
        rootSchemas
      )}"`
    );
  }

  validate(schemaName, data) {
    const validator = this.validators[schemaName];
    return validateJsonSchema(schemaName, data, validator);
  }
}

module.exports = new JsonSchemaValidator();
