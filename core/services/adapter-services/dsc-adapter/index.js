const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const boot = require("@diva/common/api/expressServer");
const IDSService = require("./services/DscAdapterService");
const adapterRouter = require("./routes/adapter");
const serviceName = require("./package.json").name;

const port = process.env.PORT || 4002;
const KAFKA_EVENT_TOPICS = process.env.KAFKA_EVENT_TOPICS
  ? JSON.parse(process.env.KAFKA_EVENT_TOPICS)
  : ["resource.events"];
const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";

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

const onMessage = async (message) => {
  try {
    const parsedMassage = JSON.parse(message.value.toString());
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

boot(
  async (app) => {
    app.use("/resources", adapterRouter);
    await messageConsumer.init(
      KAFKA_EVENT_TOPICS.map((topic) => ({
        topic,
        spec: ASYNCAPI_SPECIFICATION,
      })),
      serviceName
    );
    await messageConsumer.consume(onMessage);
    await IDSService.init();
  },
  { port }
);
