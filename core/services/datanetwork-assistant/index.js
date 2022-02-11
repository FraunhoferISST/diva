const Server = require("@diva/common/api/expressServer");
const edgesRouter = require("./routes/edges");
const datanetworkService = require("./services/DatanetworkService");
const eventsHandlerService = require("./services/EventsHandlerService");

const port = process.env.PORT || 3012;
const server = new Server(port);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/", edgesRouter);

server
  .boot()
  .then(async () => {
    await eventsHandlerService.init();
    return datanetworkService.init();
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
