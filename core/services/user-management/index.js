const boot = require("@diva/common/api/expressServer");
const messagesProducer = require("@diva/common/MessageProducer");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const { passport } = require("./utils/passport");
const usersRouter = require("./routes/users");
const userImagesRouter = require("./routes/userImages");
const usersService = require("./services/UsersService");
const serviceName = require("./package.json").name;

const port = process.env.PORT || 3001;
const topic = process.env.KAFKA_EVENT_TOPIC || "user.events";
const USER_ROOT_SCHEMA = process.env.USER_ROOT_SCHEMA || "user";
const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

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
      messagesProducer.init(topic, serviceName, "userEvents"),
      jsonSchemaValidator.init([USER_ROOT_SCHEMA, HISTORY_ROOT_SCHEMA]),
      usersService.init(),
    ]);
  },
  { port }
);
