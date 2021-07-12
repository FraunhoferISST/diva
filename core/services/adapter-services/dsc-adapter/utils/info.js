const { v4 } = require("uuid");
const microserviceName = require("../package.json").name;

module.exports = {
  microserviceName,
  microserviceId: `service:uuid:${v4()}`,
};
