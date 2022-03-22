const generateUuid = require("@diva/common/generateUuid");
const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const { setLoggerDefaultMeta, log } = require("./utils/logger");
const serviceName = require("./package.json").name;
const { bootSocket, emitEntityEvent } = require("./utils/socket");

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

const KAFKA_TOPICS = process.env.KAFKA_TOPICS
  ? JSON.parse(process.env.KAFKA_TOPICS)
  : ["entity.events", "datanetwork.events"];
const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";
const NODE_ENV = process.env.NODE_ENV || "development";

const onMessage = async (message) => {
  const parsedMassage = JSON.parse(message.value.toString());
  if (["update", "delete", "create"].includes(parsedMassage.payload.type)) {
    emitEntityEvent(parsedMassage.payload);
  }
  log.info(
    `📩 Processed message type "${parsedMassage.payload.type}" for entity "${parsedMassage.payload.object.id}"`
  );
};

const boot = async () => {
  log.info(`✅ Booting ${serviceName} in ${NODE_ENV} mode`);

  await messageConsumer.init(
    KAFKA_TOPICS.map((topic) => ({ topic, spec: ASYNCAPI_SPECIFICATION })),
    serviceName
  );
  await messageConsumer.consume(onMessage);
  return bootSocket();
};

boot()
  .then(() => log.info(`✅ All components booted successfully 🚀`))
  .catch((e) => {
    log.error(e.message);
    process.exit(1);
  });
