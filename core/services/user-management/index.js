const createServer = require("@diva/common/api/expressServer");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const usersRouter = require("./routes/users");
const userImagesRouter = require("./routes/userImages");
const usersService = require("./services/UsersService");
const usersImagesService = require("./services/UserImagesService");

const port = process.env.PORT || 3001;
const USER_ROOT_SCHEMA = process.env.USER_ROOT_SCHEMA || "user";
const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

module.exports = createServer(
  async (app) => {
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

    await Promise.all([
      jsonSchemaValidator.init([USER_ROOT_SCHEMA, HISTORY_ROOT_SCHEMA]),
      usersService.init(),
    ]);
    return usersImagesService.init();
  },
  { port }
);
