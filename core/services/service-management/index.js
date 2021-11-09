const createServer = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const servicesRouter = require("./routes/services");
const serviceService = require("./services/ServiceService");
const serviceImagesRouter = require("./routes/serviceImages");
const serviceImagesService = require("./services/ServiceImagesService");
const serviceName = require("./package.json").name;

const port = process.env.PORT || 3004;
const topic = process.env.KAFKA_EVENT_TOPIC || "service.events";
const SERVICE_ROOT_SCHEMA = process.env.SERVICE_ROOT_SCHEMA || "service";
const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

module.exports = createServer(
  async (app) => {
    // TODO: extract image file, fix until https://github.com/cdimascio/express-openapi-validator/pull/464 resolved
    app.use((req, res, next) => {
      if (req.files) {
        // eslint-disable-next-line prefer-destructuring
        req.file = req.files[0];
        delete req.body.image;
      }
      next();
    });

    app.use("/services", servicesRouter);
    app.use("/serviceImages", serviceImagesRouter);

    await Promise.all([
      messagesProducer.init(topic, serviceName, "serviceEvents"),
      jsonSchemaValidator.init([SERVICE_ROOT_SCHEMA, HISTORY_ROOT_SCHEMA]),
      serviceService.init(),
    ]);
    return serviceImagesService.init();
  },
  { port }
);
