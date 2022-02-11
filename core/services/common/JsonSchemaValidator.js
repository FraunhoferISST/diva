const axios = require("axios");
const chalk = require("chalk");
const urljoin = require("url-join");
const Ajv19 = require("ajv/dist/2019");
const addFormats = require("ajv-formats");
const { createError } = require("./Error");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";

const compileValidator = async (schemaName) => {
  const ajv = new Ajv19({ strict: false });
  addFormats(ajv);

  const { data: schema } = await axios.get(
    urljoin(SCHEMA_REGISTRY_URL, "resolvedSchemata", schemaName)
  );
  console.log(
    chalk.blue(`✅ Received all JSON Schemata for entity "${schemaName}"`)
  );
  return ajv.compile(schema);
};

const validateJsonSchema = (schemaName, data, validator) => {
  const valid = validator(data);
  if (!valid) {
    console.warn(validator.errors);
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
  async init(rootSchemas = ["entity"]) {
    this.validators = Object.fromEntries(
      await Promise.all(
        rootSchemas.map(async (schemaName) => [
          schemaName,
          await compileValidator(schemaName),
        ])
      )
    );
  }

  validate(schemaName, data) {
    const validator = this.validators[schemaName];
    return validateJsonSchema(schemaName, data, validator);
  }
}

module.exports = new JsonSchemaValidator();
