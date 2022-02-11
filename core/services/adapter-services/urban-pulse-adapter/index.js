const Server = require("@diva/common/api/expressServer");
const adapterRouter = require("./routes/adapter");

const port = process.env.PORT || 4003;
const server = new Server(port);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/", adapterRouter);

server.boot().catch((e) => {
  console.log(e);
  process.exit(1);
});
