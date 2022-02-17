const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/generateUuid");
const serviceName = require("./package.json").name;
const eventsHandlerService = require("./services/EventsHandlerService");

const serviceId = generateUuid("service");
setLoggerDefaultMeta({ serviceId });

const NODE_ENV = process.env.NODE_ENV || "development";

log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

eventsHandlerService
  .init()
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch((e) => {
    log.error(e);
    process.exit(1);
  });
