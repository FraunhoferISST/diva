const Server = require("@diva/common/api/expressServer");
const historiesRouter = require("./routes/histories");
const historiesService = require("./services/HistoriesService");
const eventsHandlerService = require("./services/EventsHandlerService");
const { mongoDbConnector } = require("./utils/mongoDbConnector");

const port = process.env.PORT || 3006;

const server = new Server(port);

server.initBasicMiddleware();
server.addMiddleware("/histories", historiesRouter);
server.addOpenApiValidatorMiddleware();

server
  .boot()
  .then(async () => {
    await mongoDbConnector.connect();
    return Promise.all([historiesService.init(), eventsHandlerService.init()]);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
