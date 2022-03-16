const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const urljoin = require("url-join");
const OpenApiValidator = require("express-openapi-validator");
const { logger: log, httpLogger, httpErrorLoger } = require("../logger");

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

const hideReqCredentials = (req) => ({
  ...req,
  headers: {
    ...req.headers,
    ...(req.headers?.authorization ? { authorization: "[MASKED]" } : {}),
  },
});

const {
  createError,
  isCustomError,
  isOpenAPISpecValidationError,
  createOpenAPIValidationError,
} = require("../Error");

const errorHandler = (err, _req, res, next) => {
  if (!res.headersSent) {
    let formattedError = err;
    if (isOpenAPISpecValidationError(err)) {
      formattedError = createOpenAPIValidationError(err);
    } else if (!isCustomError(err)) {
      formattedError = createError({ message: err.toString() });
    }
    res.status(formattedError.code).send(formattedError);
    // destructure to remove error stack trace!
    return next({ ...formattedError });
  }
};

const policyRulesMiddleware = async (req, res, next) => {
  const BUSINESS_DECISION_POINT_URL =
    process.env.BUSINESS_DECISION_POINT_URL || "http://localhost:3001/";

  const { data } = await axios
    .post(urljoin(BUSINESS_DECISION_POINT_URL, "enforcePolicies"), {
      serviceName: SERVICE_NAME,
      method: req.method,
      actorid: req.headers["x-actorid"],
      url: req.url,
      body: req.body,
    })
    .catch((error) => {
      console.error(error);
      return {
        data: {
          decision: false,
          metadata: { error: "internal server error" },
        },
      };
    });

  if (data.decision === true) {
    req.body.metadata = data.metadata;
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};

class Server {
  constructor(port, serviceName = SERVICE_NAME) {
    this.port = port;
    this.serviceName = serviceName;
    this.app = express();
  }

  initBasicMiddleware({ corsOptions = {} } = {}) {
    log.info(`✅ Setting up basic API middleware`);
    this.app.use(express.json({ limit: "10mb", extended: true }));
    this.app.use(express.urlencoded({ limit: "10mb", extended: false }));
    this.app.use(cors({ ...corsDefaults, ...corsOptions }));
    this.app.use((req, res, next) =>
      httpLogger(hideReqCredentials(req), res, next)
    );
    if (SERVICE_NAME !== "business-decision-point") {
      this.app.use(policyRulesMiddleware);
    }
  }

  addMiddleware(...args) {
    this.app.use(...args);
  }

  addErrorLoggingMiddleware() {
    log.info(`✅ Setting up API error logging middleware`);
    this.addMiddleware((err, req, res, next) =>
      httpErrorLoger(err, hideReqCredentials(req), res, next)
    );
  }

  addOpenApiValidatorMiddleware(
    apiSpec = path.join(`${WORK_DIR}`, "/apiDoc/openapi.yml")
  ) {
    log.info(`✅ Setting up OpenAPI validation middleware`);
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
    log.info(`✅ Booting API server...`);
    return new Promise((resolve, reject) => {
      try {
        this.addMiddleware(errorHandler);
        this.addErrorLoggingMiddleware();
        const expressServer = this.app.listen(this.port, () => {
          log.info(
            `✅ REST API ready at port ${expressServer.address().port} 🌐`
          );
          resolve(expressServer);
        });
      } catch (e) {
        log.error(e);
        reject(e);
      }
    });
  }
}

module.exports = Server;
