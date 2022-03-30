const urljoin = require("url-join");
const AsyncApiValidator = require("asyncapi-validator");
const asyncapiParser = require("@asyncapi/parser");
const axios = require("axios");
const { createError } = require("../Error");

/* const SCHEMA_URL =
  process.env.SCHEMA_URL || "http://localhost:3000/systemEntities/byName"; */
const SCHEMA_URL = process.env.SCHEMA_URL || "http://localhost:3010/schemata";

const fetchSpec = (specName) => axios.get(urljoin(SCHEMA_URL, specName));

const loadAsyncAPISpec = async (spec) => {
  let specification;
  if (spec.specification) {
    specification = spec.specification;
  } else {
    const { data } = await fetchSpec(spec.name);
    specification = data;
  }

  return AsyncApiValidator.fromSource(
    (await asyncapiParser.parse(specification))._json,
    {
      msgIdentifier: "name",
    }
  );
};
const validateMessage = (
  specName,
  validator,
  msg,
  { messageName, channel, operation = "publish" }
) => {
  try {
    return validator.validate(messageName, msg, channel, operation);
  } catch (validationError) {
    throw createError({
      type: validationError.name,
      message:
        validationError.message ||
        `Supplied message for the operation "${validationError.key}" violates "${specName}" schema`,
      code: 406,
      errors: validationError.errors,
    });
  }
};

class MessagesValidator {
  constructor() {
    this.validators = [];
  }

  /**
   * @param {Object[]} specs - array of objects including specification name and the specification object
   * @param {string} specs[].name - name of the specification
   * @param {Object} [specs[].specification] - corresponding AsyncAPI Specification object, if not provided, the specification will be fetched by name
   * @returns {Promise<void>}
   */
  async init(specs) {
    this.validators = Object.fromEntries(
      await Promise.all(
        specs.map(async (spec) => [spec.name, await loadAsyncAPISpec(spec)])
      )
    );
  }

  validate(specName, msg, specInfo) {
    const validator = this.validators[specName];
    return validateMessage(specName, validator, msg, specInfo);
  }
}

module.exports = MessagesValidator;
