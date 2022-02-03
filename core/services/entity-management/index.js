const Server = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const buildAppAPI = require("./buildAppAPI");
const serviceName = require("./package.json").name;

const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;

const port = process.env.PORT || 3000;
const topic = process.env.KAFKA_EVENT_TOPIC || "resource.events";

const server = new Server(port, serviceName);

buildAppAPI(server)
  .then(async () => {
    await messagesProducer.init(
      topic,
      serviceName,
      "entityEvents",
      "asyncapi",
      producer
    );
    console.info(`✅ All components booted successfully 🚀`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
