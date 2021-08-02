const messagesProducerService = require("@diva/common/messaging/MessageProducer");
const boot = require("@diva/common/api/expressServer");
const { passport } = require("../utils/passport");
const { db } = require("../utils/mongoDbConnectors");
const usersRouter = require("../routes/users");
const userImagesRouter = require("../routes/userImages");
const { loadSchemas } = require("../utils/validation/jsonSchemaValidation");

const port = 0;

const createTestServer = async () =>
  boot(
    async (app) => {
      app.use(passport.initialize());

      app.use("/users", usersRouter);
      app.use("/userImages", userImagesRouter);

      await Promise.all([
        db.connect("userTestDb"),
        messagesProducerService.init(() =>
          console.log("Faked Sending message in test mode")
        ),
        loadSchemas(),
      ]);
    },
    { port }
  );

module.exports = createTestServer;
