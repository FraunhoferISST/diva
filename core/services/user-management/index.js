const boot = require("./server");
const { passport } = require("./utils/passport");
const usersRouter = require("./routes/users");
const userImagesRouter = require("./routes/userImages");
const messagesProducer = require("./services/MessagesProducerService");
const { loadAsyncAPISpec } = require("./utils/validation/messagesValidation");
const { loadSchemas } = require("./utils/validation/jsonSchemaValidation");
const { db } = require("./utils/database");

boot((app) => {
  app.use(passport.initialize());

  app.use("/users", usersRouter);
  app.use("/userImages", userImagesRouter);

  return Promise.all([
    db.connect(),
    messagesProducer.init(),
    loadSchemas(),
    loadAsyncAPISpec(),
  ]);
});
