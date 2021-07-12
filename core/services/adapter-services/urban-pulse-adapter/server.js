const chalk = require("chalk");
const express = require("express");
const path = require("path");
const OpenApiValidator = require("express-openapi-validator");
const packageJson = require("./package.json");
const {
  createError,
  createOpenAPIValidationError,
  isCustomError,
  isOpenAPISpecValidationError,
} = require("./util/errors");

const PORT = process.env.PORT || 4003;
const NODE_ENV = process.env.NODE_ENV || "development";

const notFoundHandler = (err, req, res, next) => {
  res.status(404).send();
  next(err);
};

const errorHandler = (err, req, res, next) => {
  if (!res.headersSent) {
    if (isOpenAPISpecValidationError(err)) {
      return res.status(err.status).send(createOpenAPIValidationError(err));
    }
    if (!isCustomError(err)) {
      console.error(err);
      const unexpectedError = createError({ message: err.toString() });
      return res.status(unexpectedError.code).send(unexpectedError);
    }
    res.status(err.code).send(err);
  }
};

module.exports = (onBoot, port = PORT) =>
  new Promise(async (resolve, reject) => {
    try {
      console.info(
        chalk.blue(
          `✅ Running ${packageJson.name}:${packageJson.version} in ${NODE_ENV} mode`
        )
      );
      const app = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(
        OpenApiValidator.middleware({
          apiSpec: path.join(__dirname, "./apiDoc/openapi.yml"),
        })
      );
      await onBoot(app);
      app.use(errorHandler);
      app.use(notFoundHandler);
      const server = app.listen(port, () => {
        console.info(
          chalk.blue(`✅ REST API ready at port ${server.address().port} 🌐`)
        );
        console.info(chalk.blue(`✅ All components booted successfully 🚀`));
        resolve(server);
      });
    } catch (e) {
      console.error(e);
      reject(e);
      process.exit(1);
    }
  });
