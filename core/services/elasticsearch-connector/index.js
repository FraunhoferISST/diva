const Connector = require("./Connector");
const consume = require("./utils/broker");
const {
  loadAsyncAPISpec,
  validateMessage,
} = require("./utils/messagesValidation");
const { getDbByEntityId, getOperation } = require("./utils/utils");

const processMessage = async (message) => {
  try {
    const parsedMassage = JSON.parse(message.value.toString());
    validateMessage(parsedMassage);
    const {
      type,
      object: { id },
    } = parsedMassage.payload;
    const mongoDbData = getDbByEntityId(id);
    await getOperation(type)(mongoDbData, id);
    console.info(`💬 Processed message type "${type}" for entity "${id}"`);
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  await loadAsyncAPISpec();
  await consume(processMessage);
  await Connector.init();
  console.info("✅ Elasticsearch connector is running!");
})();
