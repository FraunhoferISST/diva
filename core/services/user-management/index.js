const boot = require("@diva/common/expressServer");
const messagesProducer = require("@diva/common/MessageProducer");
const { passport } = require("./utils/passport");
const usersRouter = require("./routes/users");
const userImagesRouter = require("./routes/userImages");
const { loadAsyncAPISpec } = require("./utils/validation/messagesValidation");
const { loadSchemas } = require("./utils/validation/jsonSchemaValidation");
const { db } = require("./utils/database");
const serviceName = require("./package.json").name;

const port = process.env.PORT || 3001;
const topic = process.env.KAFKA_EVENT_TOPIC || "user.events";

boot(
  (app) => {
    app.use(passport.initialize());

    // TODO: extract image file, fix until https://github.com/cdimascio/express-openapi-validator/pull/464 resolved
    app.use((req, res, next) => {
      if (req.files) {
        req.file = req.files[0];
        delete req.body.image;
      }
      next();
    });

    app.use("/users", usersRouter);
    app.use("/userImages", userImagesRouter);

    return Promise.all([
      db.connect(),
      messagesProducer.init(topic, serviceName),
      loadSchemas(),
      loadAsyncAPISpec(),
    ]);
  },
  { port }
);
