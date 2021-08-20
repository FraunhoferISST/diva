const boot = require("@diva/common/api/expressServer");

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
