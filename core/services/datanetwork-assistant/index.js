const Server = require("@diva/common/api/expressServer");
const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/generateUuid");
const messageProducer = require("@diva/common/messaging/MessageProducer");
const edgesRouter = require("./routes/network");
const datanetworkService = require("./services/DatanetworkService");
const eventsHandlerService = require("./services/EventsHandlerService");
const serviceName = require("./package.json").name;

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const NODE_ENV = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3012;
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;
const producerTopic = process.env.KAFKA_EVENT_TOPIC || "datanetwork.events";

const server = new Server(port);

log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/", edgesRouter);

server
  .boot()
  .then(async () => {
    await eventsHandlerService.init();
    return datanetworkService.init();
  })
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch((e) => {
    log.error(e);
    process.exit(1);
  });
