const Server = require("@diva/common/api/expressServer");
const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/generateUuid");
const edgesRouter = require("./routes/network");
const eventsConsumerService = require("./services/EventsConsumerService");
const datanetworkController = require("./controllers/DatanetworkController");
const { name: serviceName } = require("./package.json");

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const NODE_ENV = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3012;
const server = new Server(port);

log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/", edgesRouter);

server
  .boot()
  .then(async () => {
    await datanetworkController.init();
    return eventsConsumerService.init();
  })
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch((e) => {
    log.error(e);
    process.exit(1);
  });
