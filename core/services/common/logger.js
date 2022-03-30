const path = require("path");
const winston = require("winston");
const expressWinston = require("express-winston");
require("winston-daily-rotate-file");

const { transports, format } = winston;

const LOG_LEVEL =
  process.env.SYSTEM_LOG_LEVEL ||
  (process.env.NODE_ENV === "production" ? "info" : "http");

let WORK_DIR = process.cwd();
if (process.pkg?.entrypoint) {
  const pkgEntryPoint = process.pkg?.entrypoint ?? "";
  WORK_DIR = pkgEntryPoint.substring(0, pkgEntryPoint.lastIndexOf("/") + 1);
}
const SERVICE_NAME = require(path.join(`${WORK_DIR}`, "/package.json")).name;

const rotateTransport = new winston.transports.DailyRotateFile({
  filename: process.env.LOG_PATH || `logs/${SERVICE_NAME}-%DATE%.log`,
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "7d",
});

const defaultMeta = {
  serviceName: SERVICE_NAME,
};

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.timestamp(),
    format.metadata({
      fillExcept: ["message", "level", "timestamp", "serviceName", "serviceId"],
    }),
    winston.format.json()
  ),
  defaultMeta,
  transports: [rotateTransport],
});

// If we're not in production then log to the console
// TODO: need to decide if we need console log in production
if (process.env.NODE_ENV === "production") {
  logger.add(new transports.Console());
} else {
  logger.add(new transports.Console({ format: format.prettyPrint() }));
}

const setLoggerDefaultMeta = (opt) => {
  logger.defaultMeta = { ...defaultMeta, ...opt };
};

const httpLogger = () =>
  expressWinston.logger({
    winstonInstance: logger,
    level: "http",
    meta: true,
    metaField: null,
    skip: (req, res) => res.statusCode >= 400,
    msg: `📦 HTTP {{req.method}} {{res.statusCode}}: {{req.headers["x-actorid"]}} requested {{req.url}}`,
  });

const httpErrorLogger = () =>
  expressWinston.errorLogger({
    winstonInstance: logger,
    level: (req, res) => {
      let level = "warn";
      if (res.statusCode >= 500) {
        level = "error";
      }
      return level;
    },
    meta: true,
    metaField: null,
    blacklistedMetaFields: [
      "process",
      "date",
      "os",
      "trace",
      "stack",
      "exception",
    ], // fields to blacklist from meta data
    dynamicMeta: (req, res) => ({
      res: {
        statusCode: res.statusCode,
      },
    }),
    msg: `📦 HTTP {{req.method}} {{res.statusCode}}: {{req.headers["x-actorid"]}} requested {{req.url}}`,
  });

module.exports = {
  logger,
  httpLogger: httpLogger(),
  httpErrorLogger: httpErrorLogger(),
  setLoggerDefaultMeta,
};
