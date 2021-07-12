const boot = require("./server");
const resourcesService = require("./services/ResourcesService");
const messageProducerService = require("./services/MessageProducerService");
const { loadSchemas } = require("./utils/validation/jsonSchemaValidation");
const { loadAsyncAPISpec } = require("./utils/validation/messagesValidation");
const resourcesRouter = require("./routes/resources");

boot((app) => {
  app.use("/resources", resourcesRouter);
  return Promise.all([
    resourcesService.init(),
    messageProducerService.init(),
    loadSchemas(),
    loadAsyncAPISpec(),
  ]);
});
