const urljoin = require("url-join");
const AsyncApiValidator = require("asyncapi-validator");
const { createError } = require("../Error");

const SCHEMA_URL =
  process.env.SCHEMA_URL || "http://localhost:3000/systemEntities";

const loadAsyncAPISpec = (spec) => {
  if (spec.specification) {
    return AsyncApiValidator.fromSource(spec.specification, {
      msgIdentifier: "name",
    });
  }
  return AsyncApiValidator.fromSource(urljoin(SCHEMA_URL, spec.name), {
    msgIdentifier: "name",
  });
};
const validateMessage = (
  spec,
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
        `Supplied message for the operation "${validationError.key}" violates "${spec}" schema`,
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

  validate(spec, msg, specInfo) {
    const validator = this.validators[spec];
    return validateMessage(spec, validator, msg, specInfo);
  }
}

module.exports = MessagesValidator;
