const path = require("path");
const winston = require("winston");

const { transports, format } = winston;

const LOG_LEVEL = process.env.LOG_LEVEL || "info";
let WORK_DIR = process.cwd();
if (process.pkg?.entrypoint) {
  const pkgEntryPoint = process.pkg?.entrypoint ?? "";
  WORK_DIR = pkgEntryPoint.substring(0, pkgEntryPoint.lastIndexOf("/") + 1);
}
const SERVICE_NAME = require(path.join(`${WORK_DIR}`, "/package.json")).name;

const defaultMeta = {
  service: SERVICE_NAME,
};

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.timestamp(),
    format.metadata({
      fillExcept: ["message", "level", "timestamp", "service", "serviceId"],
    }),
    winston.format.json()
  ),
  defaultMeta,
  transports: [new transports.File({ filename: "combined.log" })],
});

// If we're not in production then log to the console
// TODO: need to decide if we need console log in production
if (process.env.NODE_ENV === "production") {
  logger.add(new transports.Console());
}

// If we're not in production then log to the console
// TODO: need to decide if we need console log in production
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({ format: format.prettyPrint() }));
}

const setLoggerDefaultMeta = (opt) => {
  logger.defaultMeta = { ...defaultMeta, ...opt };
};

module.exports = {
  logger,
  setLoggerDefaultMeta,
};
