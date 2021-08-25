const createServer = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const assetsRouter = require("./routes/assets");
const assetService = require("./services/AssetService");
const assetImagesRouter = require("./routes/assetImages");
const assetImagesService = require("./services/AssetImagesService");
const serviceName = require("./package.json").name;

const port = process.env.PORT || 3002;
const topic = process.env.KAFKA_EVENT_TOPIC || "asset.events";
const ASSET_ROOT_SCHEMA = process.env.ASSET_ROOT_SCHEMA || "asset";
const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

module.exports = createServer(
  async (app) => {
    // TODO: extract image file, fix until https://github.com/cdimascio/express-openapi-validator/pull/464 resolved
    app.use((req, res, next) => {
      if (req.files) {
        req.file = req.files[0];
        delete req.body.image;
      }
      next();
    });

    app.use("/assets", assetsRouter);
    app.use("/assetImages", assetImagesRouter);

    await Promise.all([
      messagesProducer.init(topic, serviceName, "assetEvents"),
      jsonSchemaValidator.init([ASSET_ROOT_SCHEMA, HISTORY_ROOT_SCHEMA]),
      assetService.init(),
    ]);
    return assetImagesService.init();
  },
  { port }
);
