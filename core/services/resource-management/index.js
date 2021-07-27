const boot = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const resourcesService = require("./services/ResourcesService");
const resourcesRouter = require("./routes/resources");
const serviceName = require("./package.json").name;

const port = process.env.PORT || 3000;
const topic = process.env.KAFKA_EVENT_TOPIC || "resource.events";

boot(
  (app) => {
    app.use("/resources", resourcesRouter);
    return Promise.all([
      resourcesService.init(),
      messagesProducer.init(topic, serviceName, "resourceEvents"),
    ]);
  },
  { port }
);
