const createServer = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const resourcesService = require("./services/ResourcesService");
const buildAppAPI = require("./buildAppAPI");
const serviceName = require("./package.json").name;

const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;

const port = process.env.PORT || 3000;
const topic = process.env.KAFKA_EVENT_TOPIC || "resource.events";

module.exports = createServer(
  async (app) => {
    await buildAppAPI(app);
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
