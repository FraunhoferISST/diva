const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/utils/generateUuid");
const eventsHandlerService = require("./services/EventsHandlerService");
const serviceName = require("./package.json").name;

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const NODE_ENV = process.env.NODE_ENV || "development";

log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

(async () => {
  try {
    await eventsHandlerService.init();
    log.info(`✅ All components booted successfully 🚀`);
  } catch (e) {
    log.error(`${e.message}`);
    process.exit(1);
  }
})();
