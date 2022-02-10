const Server = require("@diva/common/api/expressServer");
const analyticsRouter = require("./routes/analytics");
const GlobalAnalyticsService = require("./services/AnalyticsService");

const port = process.env.PORT || 3007;
const server = new Server(port);

server.initBasicMiddleware();
server.addOpenApiValidatorMiddleware();
server.addMiddleware("/analytics", analyticsRouter);

server
  .boot()
  .then(async () => GlobalAnalyticsService.init())
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
