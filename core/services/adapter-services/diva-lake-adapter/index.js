const Server = require("@diva/common/api/expressServer");
const adapterRouter = require("./routes/adapter");
const divaLakeService = require("./services/DivaLakeService");
const eventsHandlerService = require("./services/EventsHandlerService");
const { mongoDbConnector } = require("./utils/mongoDbConnectors");

const port = process.env.PORT || 4001;
const server = new Server(port);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/", adapterRouter);

server
  .boot()
  .then(() =>
    mongoDbConnector
      .connect()
      .then(() =>
        Promise.all([divaLakeService.init(), eventsHandlerService.init()])
      )
  )
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
