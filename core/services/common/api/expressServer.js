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
  allowedHeaders: ["Content-Type", "x-actorid", "Authorization"],
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

class Server {
  constructor(port, serviceName = SERVICE_NAME) {
    this.port = port;
    this.serviceName = serviceName;
    this.app = express();
  }

  initBasicMiddleware({ corsOptions = {} } = {}) {
    this.app.use(express.json({ limit: "10mb", extended: true }));
    this.app.use(express.urlencoded({ limit: "10mb", extended: false }));
    this.app.use(cors({ ...corsDefaults, ...corsOptions }));
  }

  addMiddleware(...args) {
    this.app.use(...args);
  }

  addOpenApiValidatorMiddleware(
    apiSpec = path.join(`${WORK_DIR}`, "/apiDoc/openapi.yml")
  ) {
    this.addMiddleware(
      OpenApiValidator.middleware({
        apiSpec,
      })
    );
    if (NODE_ENV === "development") {
      this.addMiddleware("/api", (req, res) => res.json(apiSpec));
    }
  }

  async boot() {
    return new Promise((resolve, reject) => {
      try {
        this.addMiddleware(errorHandler);
        const expressServer = this.app.listen(this.port, () => {
          console.info(
            chalk.blue(`✅ REST API ready at port ${expressServer.address().port} 🌐`)
          );
          resolve(expressServer);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = Server;
