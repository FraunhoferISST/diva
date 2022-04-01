const Server = require("@diva/common/api/expressServer");
const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/utils/generateUuid");
const historiesRouter = require("./routes/histories");
const historiesService = require("./services/HistoriesService");
const eventsHandlerService = require("./services/EventsHandlerService");
const { mongoDbConnector } = require("./utils/mongoDbConnector");
const serviceName = require("./package.json").name;

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const port = process.env.PORT || 3006;
const NODE_ENV = process.env.NODE_ENV || "development";
const server = new Server(port);

log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

server.initBasicMiddleware();
server.addMiddleware("/histories", historiesRouter);
server.addOpenApiValidatorMiddleware();

server
  .boot()
  .then(async () => {
    await mongoDbConnector.connect();
    return Promise.all([historiesService.init(), eventsHandlerService.init()]);
  })
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch((e) => {
    log.error(e);
    process.exit(1);
  });
