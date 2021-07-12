const chalk = require("chalk");
const urljoin = require("url-join");
const AsyncApiValidator = require("asyncapi-validator");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";
const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";
const EVENT_EMITTER_SPECIFICATION =
  process.env.EVENT_EMITTER_SPECIFICATION || "event-emitter-api";

let asyncApiValidator = "";
let eventEmitterApiValidator = "";

const loadAsyncAPISpec = async () => {
  try {
    asyncApiValidator = await AsyncApiValidator.fromSource(
      urljoin(SCHEMA_REGISTRY_URL, "schemata", ASYNCAPI_SPECIFICATION),
      {
        msgIdentifier: "name",
      }
    );
    console.log(chalk.blue(`✅ Received AsyncAPI Schema`));
  } catch (e) {
    throw new Error(`🛑 Could not get AsyncAPI Schema`);
  }
};

const loadEventEmitterApiSpec = async () => {
  try {
    eventEmitterApiValidator = await AsyncApiValidator.fromSource(
      urljoin(SCHEMA_REGISTRY_URL, "schemata", EVENT_EMITTER_SPECIFICATION),
      {
        msgIdentifier: "name",
      }
    );
    console.log(chalk.blue(`✅ Received Event Emitter API Schema`));
  } catch (e) {
    throw new Error(`🛑 Could not get Event Emitter API Schema`);
  }
};

const validateBrokerMessage = (msg, operation = "publish") => {
  try {
    return asyncApiValidator.validate(
      msg.messageName,
      msg,
      msg.channel,
      operation
    );
  } catch (validationError) {
    console.error(validationError);
    throw new Error(
      `🛑 Supplied message for the operation "${validationError.key}" violates "${ASYNCAPI_SPECIFICATION}" schema`
    );
  }
};

const validateSocketMessage = (
  msgName,
  msg,
  channel,
  operation = "publish"
) => {
  try {
    return eventEmitterApiValidator.validate(msgName, msg, channel, operation);
  } catch (validationError) {
    console.error(validationError);
    throw new Error(
      `🛑 Supplied message for the operation "${validationError.key}" violates "${EVENT_EMITTER_SPECIFICATION}" schema`
    );
  }
};

module.exports = {
  validateSocketMessage,
  validateBrokerMessage,
  loadAsyncAPISpec,
  loadEventEmitterApiSpec,
};
