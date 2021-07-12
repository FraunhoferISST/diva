const AsyncApiValidator = require("asyncapi-validator");
const urljoin = require("url-join");

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
  console.log(`✅ Received AsyncAPI Schema`);
};

const validateMessage = (msg, operation = "subscribe") =>
  asyncApiValidator.validate(msg.messageName, msg, msg.channel, operation);
module.exports = {
  validateMessage,
  loadAsyncAPISpec,
};
