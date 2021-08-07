const serverCreationPromise = require("../index");

let server = null;
(async () => {
  server = await serverCreationPromise;
})();

module.exports = server;
