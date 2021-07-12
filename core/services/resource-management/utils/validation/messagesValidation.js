const urljoin = require("url-join");
const AsyncApiValidator = require("asyncapi-validator");
const { createError } = require("../errors");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";

const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";

let asyncApiValidator = "";

const loadAsyncAPISpec = async () => {
  asyncApiValidator = await AsyncApiValidator.fromSource(
    urljoin(SCHEMA_REGISTRY_URL, "schemata", ASYNCAPI_SPECIFICATION),
    {
      msgIdentifier: "name",
    }
  );
};

const validateMessage = (msg, operation = "publish") => {
  try {
    return asyncApiValidator.validate(
      msg.messageName,
      msg,
      msg.channel,
      operation
    );
  } catch (validationError) {
    console.error(validationError);
    throw createError({
      type: validationError.name,
      message: `Supplied message for the operation "${validationError.key}" violates "${ASYNCAPI_SPECIFICATION}" schema`,
      code: 406,
      errors: validationError.errors,
    });
  }
};
module.exports = {
  validateMessage,
  loadAsyncAPISpec,
};
