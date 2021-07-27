const messagesProducer = require("@diva/common/messaging/MessageProducer");
const boot = require("@diva/common/api/expressServer");
const reviewsRouter = require("./routes/reviews");
const reviewsService = require("./services/ReviewsService");
const serviceName = require("./package.json").name;

const port = process.env.PORT || 3003;
const topic = process.env.KAFKA_EVENT_TOPIC || "review.events";

boot(
  (app) => {
    app.use("/reviews", reviewsRouter);

    return Promise.all([
      reviewsService.init(),
      messagesProducer.init(topic, serviceName, "reviewEvents"),
    ]);
  },
  { port }
);
