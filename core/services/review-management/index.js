const boot = require("./server");
const reviewsRouter = require("./routes/reviews");
const messagesProducer = require("./services/MessagesProducerService");
const reviewsService = require("./services/ReviewsService");
const { loadAsyncAPISpec } = require("./utils/validation/messagesValidation");
const { loadSchemas } = require("./utils/validation/jsonSchemaValidation");

boot((app) => {
  app.use("/reviews", reviewsRouter);

  return Promise.all([
    reviewsService.init(),
    messagesProducer.init(),
    loadSchemas(),
    loadAsyncAPISpec(),
  ]);
});
