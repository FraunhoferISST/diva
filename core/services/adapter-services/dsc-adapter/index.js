const boot = require("./server");
const IDSService = require("./services/DscAdapterService");
const adapterRouter = require("./routes/adapter");
const consume = require("./utils/broker");
const {
  loadAsyncAPISpec,
  validateMessage,
} = require("./utils/messagesValidation");

const getOperationByMessageType = (type) => {
  const operationsMap = {
    update: (resourceId) => IDSService.handleUpdateEvent(resourceId),
    delete: (resourceId) => IDSService.handleDeleteEvent(resourceId),
  };
  return (
    operationsMap[type] ??
    (() => console.warn(`No operation for message type ${type}`))
  );
};

const processMassage = async (message) => {
  try {
    const parsedMassage = JSON.parse(message.value.toString());
    validateMessage(parsedMassage);
    const {
      type,
      object: { id: resourceId },
      actor: { id: actorId },
    } = parsedMassage.payload;
    await getOperationByMessageType(type)(resourceId, actorId);
    console.info(
      `📩 Processed message type "${type}" for resource "${resourceId}"`
    );
  } catch (err) {
    console.error(err);
  }
};

boot(async (app) => {
  app.use("/resources", adapterRouter);
  await consume(processMassage);
  return Promise.all([IDSService.init(), loadAsyncAPISpec()]);
});
