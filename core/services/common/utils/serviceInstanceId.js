const generateUuid = require("./generateUuid");

const serviceInstanceId = generateUuid("service");
module.exports = { serviceInstanceId };
