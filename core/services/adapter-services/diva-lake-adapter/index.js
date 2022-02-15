const Server = require("@diva/common/api/expressServer");
const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/generateUuid");
const adapterRouter = require("./routes/adapter");
const divaLakeService = require("./services/DivaLakeService");
const eventsHandlerService = require("./services/EventsHandlerService");
const { mongoDbConnector } = require("./utils/mongoDbConnectors");
const serviceName = require("./package.json").name;

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const NODE_ENV = process.env.NODE_ENV || "development";
const port = process.env.PORT || 4001;
const server = new Server(port);

log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/", adapterRouter);

server
  .boot()
  .then(() =>
    mongoDbConnector
      .connect()
      .then(() =>
        Promise.all([divaLakeService.init(), eventsHandlerService.init()])
      )
      .then(() => log.info(`✅ All components booted successfully 🚀`))
  )
  .catch(() => process.exit(1));
