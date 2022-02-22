const Server = require("@diva/common/api/expressServer");
const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/generateUuid");
const schemaService = require("./services/SchemaService");
const schemaRouter = require("./routes/schemata");
const serviceName = require("./package.json").name;

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const NODE_ENV = process.env.NODE_ENV || "development";
const port = process.env.PORT || "3010";
const server = new Server(port);

log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware(schemaRouter);
server
  .boot()
  .then(() => schemaService.init())
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch((e) => {
    log.error(e);
    process.exit(1);
  });
