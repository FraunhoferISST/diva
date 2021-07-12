const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const path = require("path");
const OpenApiValidator = require("express-openapi-validator");
const packageJson = require("./package.json");
const {
  createError,
  isOpenAPISpecValidationError,
  isCustomError,
  createOpenAPIValidationError,
} = require("./utils/errors");

const PORT = process.env.PORT || 3007;
const NODE_ENV = process.env.NODE_ENV || "development";
const corsOpt = {
  origin: process.env.CORS_ALLOW_ORIGIN || "*",
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

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

module.exports = (onBoot, port = PORT) =>
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
      app.use(cors(corsOpt));
      app.use(
        OpenApiValidator.middleware({
          apiSpec: path.join(__dirname, "./apiDoc/openapi.yml"),
        })
      );

      await onBoot(app);
      app.use(errorHandler);
      const server = app.listen(port, () => {
        console.info(
          chalk.blue(`✅ API ready at port ${server.address().port} 🌐`)
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
