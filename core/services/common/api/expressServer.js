const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const path = require("path");
const OpenApiValidator = require("express-openapi-validator");

let WORK_DIR = process.cwd();
const NODE_ENV = process.env.NODE_ENV || "development";

if (process.pkg?.entrypoint) {
  const pkgEntryPoint = process.pkg?.entrypoint ?? "";
  WORK_DIR = pkgEntryPoint.substring(0, pkgEntryPoint.lastIndexOf("/") + 1);
}

const SERVICE_NAME = require(path.join(`${WORK_DIR}`, "/package.json")).name;

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
} = require("../Error");

// const packageJson = require(path.join(`${WORK_DIR}`, "package.json"));

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
  new Promise(async (resolve) => {
    try {
      console.info(
        chalk.blue(`✅ Running ${SERVICE_NAME} in ${NODE_ENV} mode`)
      );
      const app = express();
      app.use(express.json({ limit: "10mb", extended: true }));
      app.use(express.urlencoded({ limit: "10mb", extended: false }));
      app.use(cors({ ...corsDefaults, ...corsOptions }));
      app.use(
        OpenApiValidator.middleware({
          apiSpec:
            openapiPath || path.join(`${WORK_DIR}`, "/apiDoc/openapi.yml"),
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
