const Server = require("@diva/common/api/expressServer");
const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/generateUuid");
const businessRulesService = require("./services/BusinessRulesService");
const policyRulesService = require("./services/PolicyRulesService");
const businessRulesRouter = require("./routes/businessRules");
const policyRulesRouter = require("./routes/policyRules");
const { mongoDBConnector, neo4jConnector } = require("./utils/dbConnectors");
const serviceName = require("./package.json").name;

const serviceId = generateUuid("service");
setLoggerDefaultMeta({ serviceId });

const port = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";
const server = new Server(port);

log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/", businessRulesRouter);
server.addMiddleware("/", policyRulesRouter);

server
  .boot()
  .then(async () => {
    await mongoDBConnector.connect();
    await neo4jConnector.connect();
    return Promise.all([
      businessRulesService.init(),
      policyRulesService.init(),
    ]);
  })
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch((e) => {
    log.error(e);
    process.exit(1);
  });
