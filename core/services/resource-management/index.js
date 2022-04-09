const createServer = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const resourcesService = require("./services/ResourcesService");
const resourcesRouter = require("./routes/resources");
const serviceName = require("./package.json").name;

const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;

const port = process.env.PORT || 3000;
const topic = process.env.KAFKA_EVENT_TOPIC || "resource.events";

module.exports = createServer(
  (app) => {
    app.use("/resources", resourcesRouter);
    return Promise.all([
      resourcesService.init(),
      messagesProducer.init(
        topic,
        serviceName,
        "resourceEvents",
        "asyncapi",
        producer
      ),
    ]);
  },
  { port }
);