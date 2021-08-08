const messagesProducer = require("@diva/common/messaging/MessageProducer");
const createServer = require("@diva/common/api/expressServer");
const reviewsRouter = require("./routes/reviews");
const reviewsService = require("./services/ReviewsService");
const serviceName = require("./package.json").name;

const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;

const port = process.env.PORT || 3003;
const topic = process.env.KAFKA_EVENT_TOPIC || "review.events";

module.exports = createServer(
  (app) => {
    app.use("/reviews", reviewsRouter);

    return Promise.all([
      reviewsService.init(),
      messagesProducer.init(
        topic,
        serviceName,
        "reviewEvents",
        "asyncapi",
        producer()
      ),
    ]);
  },
  { port }
);
