const Server = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const { setLoggerDefaultMeta, logger: log } = require("@diva/common/logger");
const generateUuid = require("@diva/common/utils/generateUuid");
const buildAppAPI = require("./buildAppAPI");
const serviceName = require("./package.json").name;
require("./services/SystemEntitiesService");

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const port = process.env.PORT || 3000;

const server = new Server(port, serviceName);

module.exports = buildAppAPI(server)
  .then(async (runningServer) => runningServer)
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch((e) => {
    log.error(e);
    process.exit(1);
  });
