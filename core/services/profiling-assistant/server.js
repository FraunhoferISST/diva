const express = require("express");
const chalk = require("chalk");
const path = require("path");
const OpenApiValidator = require("express-openapi-validator");
const packageJson = require("./package.json");
const {
  createError,
  isOpenAPISpecValidationError,
  isCustomError,
  createOpenAPIValidationError,
} = require("./utils/errors");

const ACTOR_ID_HEADER = "x-actorid";
const PORT = process.env.PORT || 3011;
const NODE_ENV = process.env.NODE_ENV || "development";

// eslint-disable-next-line no-unused-vars
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

module.exports = (onBoot) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      console.info(
        chalk.blue(
          `✅ Running ${packageJson.name}:${packageJson.version} in ${NODE_ENV} mode`
        )
      );
      const app = express();
      app.use(express.json({ limit: "10mb", extended: true }));
      app.use(express.urlencoded({ limit: "10mb", extended: false }));
      app.use(
        OpenApiValidator.middleware({
          apiSpec: path.join(__dirname, "./apiDoc/openapi.yml"),
        })
      );
      app.use((req, res, next) => {
        req.actorid = req.headers[ACTOR_ID_HEADER];
        return next();
      });
      onBoot(app);
      app.use(errorHandler);
      app.listen(PORT, () => {
        console.info(chalk.blue(`✅ REST API ready at port ${PORT} 🌐`));
        console.info(chalk.blue(`✅ All components booted successfully 🚀`));
        resolve(app);
      });
    } catch (e) {
      console.error(e);
      reject(e);
      process.exit(1);
    }
  });
