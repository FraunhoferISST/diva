const Server = require("@diva/common/api/expressServer");
const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/generateUuid");
const profilingRouter = require("./routes/profiling");
const profilingService = require("./services/ProfilingService");
const serviceName = require("./package.json").name;

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const NODE_ENV = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3011;
const server = new Server(port);

log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/profiling", profilingRouter);

server
  .boot()
  .then(() => profilingService.init())
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch(() => process.exit(1));
