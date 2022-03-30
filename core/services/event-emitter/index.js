const generateUuid = require("@diva/common/generateUuid");
const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const { setLoggerDefaultMeta, log } = require("./utils/logger");
const serviceName = require("./package.json").name;
const { bootSocket, emitEntityEvent } = require("./utils/socket");

const serviceId = generateUuid("service");

setLoggerDefaultMeta({ serviceId });

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
    [
      {
        topic: "entity.events",
        spec: {
          name: "asyncapi",
        },
      },
      {
        topic: "datanetwork.events",
        spec: {
          name: "datanetwork-api",
        },
      },
    ],
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
