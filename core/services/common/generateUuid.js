const { v4 } = require("uuid");

module.exports = (prefix) => `${prefix}:uuid:${v4()}`;
