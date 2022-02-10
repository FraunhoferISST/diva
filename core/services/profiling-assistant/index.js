const Server = require("@diva/common/api/expressServer");
const profilingRouter = require("./routes/profiling");
const profilingService = require("./services/ProfilingService");

const port = process.env.PORT || 3011;
const server = new Server(port);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/profiling", profilingRouter);

server
  .boot()
  .then(async () => {
    await profilingService.init();
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
