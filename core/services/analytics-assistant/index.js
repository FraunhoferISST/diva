const Server = require("@diva/common/api/expressServer");
const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/generateUuid");
const analyticsRouter = require("./routes/analytics");
const GlobalAnalyticsService = require("./services/AnalyticsService");
const serviceName = require("./package.json").name;

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const NODE_ENV = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3007;
const server = new Server(port);

log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/analytics", analyticsRouter);

server
  .boot()
  .then(async () => GlobalAnalyticsService.init())
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch(() => process.exit(1));
