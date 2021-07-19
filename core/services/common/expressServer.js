const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const path = require("path");
const OpenApiValidator = require("express-openapi-validator");
const WORK_DIR = process.cwd();
const NODE_ENV = process.env.NODE_ENV || "development";
const corsDefaults = {
  origin: process.env.CORS_ALLOW_ORIGIN || "*",
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

const {
  createError,
  isCustomError,
  isOpenAPISpecValidationError,
  createOpenAPIValidationError,
} = require(`${WORK_DIR}/utils/errors`);
const packageJson = require(`${WORK_DIR}/package.json`);

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

module.exports = (onBoot, { port, openapiPath, corsOptions = {} }) =>
  new Promise(async (resolve, reject) => {
    try {
      console.info(
        chalk.blue(
          `✅ Running ${packageJson.name}:${packageJson.version} in ${NODE_ENV} mode`
        )
      );
      const app = express();
      app.use(cors({ ...corsDefaults, ...corsOptions }));
      app.use(
        OpenApiValidator.middleware({
          apiSpec: openapiPath || `${WORK_DIR}/apiDocs/openapi.yml`,
        })
      );

      await onBoot(app);
      app.use(errorHandler);

      const server = app.listen(port, () => {
        console.info(
          chalk.blue(`✅ REST API ready at port ${server.address().port} 🌐`)
        );
        console.info(chalk.blue(`✅ All components booted successfully 🚀`));
        resolve(server);
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
