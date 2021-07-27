const chalk = require("chalk");
const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const messagesValidator = require("@diva/common/messaging/MessagesValidator");
const serviceName = require("./package.json").name;
const { bootSocket, emitEntityEvent } = require("./utils/socket");

const KAFKA_TOPICS = ["resource.events", "asset.events", "user.events"];
const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";
const EVENT_EMITTER_SPECIFICATION =
  process.env.EVENT_EMITTER_SPECIFICATION || "event-emitter-api";

const NODE_ENV = process.env.NODE_ENV || "development";

const onMessage = async (message) => {
  try {
    const parsedMassage = JSON.parse(message.value.toString());

    if (["update", "delete", "create"].includes(parsedMassage.payload.type)) {
      emitEntityEvent(parsedMassage.payload);
    }

    console.info(
      chalk.green(
        `📩 Processed message type "${parsedMassage.payload.type}" for entity "${parsedMassage.payload.object.id}"`
      )
    );
  } catch (err) {
    console.error(err);
  }
};

const boot = async () => {
  console.info(chalk.blue(`✅ Running service in ${NODE_ENV} mode`));

  await messageConsumer.init(
    KAFKA_TOPICS.map((topic) => ({ topic, spec: ASYNCAPI_SPECIFICATION })),
    serviceName
  );
  await messagesValidator.init([EVENT_EMITTER_SPECIFICATION]);
  await messageConsumer.consume(onMessage);
  await bootSocket();
};

boot()
  .then(() =>
    console.info(chalk.blue(`✅ All components booted successfully 🚀`))
  )
  .catch((e) => {
    console.error(chalk.red(e));
    process.exit(1);
  });
