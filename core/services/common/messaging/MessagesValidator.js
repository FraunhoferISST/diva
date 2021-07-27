const urljoin = require("url-join");
const AsyncApiValidator = require("asyncapi-validator");
const { createError } = require("../Error");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";

const loadAsyncAPISpec = (spec) =>
  AsyncApiValidator.fromSource(urljoin(SCHEMA_REGISTRY_URL, "schemata", spec), {
    msgIdentifier: "name",
  });

const validateMessage = (spec, validator, msg, operation = "publish") => {
  try {
    return validator.validate(msg.messageName, msg, msg.channel, operation);
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
  async init(specs) {
    this.validators = Object.fromEntries(
      await Promise.all(
        specs.map(async (spec) => [spec, await loadAsyncAPISpec(spec)])
      )
    );
  }

  validate(spec, msg, operation) {
    const validator = this.validators[spec];
    return validateMessage(spec, validator, msg, operation);
  }
}

module.exports = new MessagesValidator();
