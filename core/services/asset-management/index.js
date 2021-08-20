const createServer = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const assetsRouter = require("./routes/assets");
const assetService = require("./services/AssetService");
const serviceName = require("./package.json").name;

const port = process.env.PORT || 3002;
const topic = process.env.KAFKA_EVENT_TOPIC || "asset.events";
const ASSET_ROOT_SCHEMA = process.env.ASSET_ROOT_SCHEMA || "asset";
const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

module.exports = createServer(
  (app) => {
    app.use("/assets", assetsRouter);

    return Promise.all([
      messagesProducer.init(topic, serviceName, "assetEvents"),
      jsonSchemaValidator.init([ASSET_ROOT_SCHEMA, HISTORY_ROOT_SCHEMA]),
      assetService.init(),
    ]);
  },
  { port }
);
