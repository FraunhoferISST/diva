const path = require("path");
const winston = require("winston");
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

module.exports = {
  logger,
  setLoggerDefaultMeta,
};
