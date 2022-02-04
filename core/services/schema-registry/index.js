const Server = require("@diva/common/api/expressServer");
const schemaService = require("./services/SchemaService");
const schemaRouter = require("./routes/schemata");

const port = process.env.PORT || "3010";

const server = new Server(port);

server.initBasicMiddleware();
server.addMiddleware(schemaRouter);
server
  .boot()
  .then(async () => {
    await schemaService.init();
    console.info(`✅ All components booted successfully 🚀`);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
