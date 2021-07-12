const chalk = require("chalk");

const packageJson = require("./package.json");
const {
  loadAsyncAPISpec,
  loadEventEmitterApiSpec,
  validateBrokerMessage,
} = require("./utils/messagesValidation");
const consume = require("./utils/broker");
const { bootSocket, emitEntityEvent } = require("./utils/socket");

const NODE_ENV = process.env.NODE_ENV || "development";

const processMessage = async (message) => {
  try {
    const parsedMassage = JSON.parse(message.value.toString());
    validateBrokerMessage(parsedMassage);

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
  console.info(
    chalk.blue(
      `✅ Running ${packageJson.name}:${packageJson.version} in ${NODE_ENV} mode`
    )
  );

  await loadAsyncAPISpec();
  await loadEventEmitterApiSpec();
  await consume(processMessage);
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
