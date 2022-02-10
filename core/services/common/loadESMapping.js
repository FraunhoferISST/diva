const axios = require("axios");
const urljoin = require("url-join");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";

module.exports = async () =>
  axios.get(urljoin(SCHEMA_REGISTRY_URL, "esmappings")).then((res) => res.data);
