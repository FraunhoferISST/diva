const boot = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const edgesRouter = require("./routes/edges");
const datanetworkService = require("./services/DatanetworkService");
const serviceName = require("./package.json").name;

const port = process.env.PORT || 3013;
const NODE_ENV = process.env.NODE_ENV || "development";
// const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;
const topic = process.env.KAFKA_EVENT_TOPIC || "datanetwork.events";

boot(
  async (app) => {
    app.use("/datanetwork", edgesRouter);
    await messagesProducer.init(topic, serviceName, "datanetworkEvents");
    return datanetworkService.init();
  },
  { port }
);
