const Server = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/generateUuid");
const buildAppAPI = require("./buildAppAPI");
const serviceName = require("./package.json").name;

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;

const port = process.env.PORT || 3000;
const topic = process.env.KAFKA_EVENT_TOPIC || "entity.events";

const server = new Server(port, serviceName);

module.exports = buildAppAPI(server)
  .then(async (runningServer) => {
    await messagesProducer.init(
      topic,
      serviceName,
      "entityEvents",
      "asyncapi",
      producer
    );
    return runningServer;
  })
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch((e) => {
    log.error(e);
    process.exit(1);
  });
