const Server = require("@diva/common/api/expressServer");
const searchRouter = require("./routes/search");
const searchService = require("./services/SearchService");

const port = process.env.PORT || 3005;

const server = new Server(port);

server.initBasicMiddleware();
server.addMiddleware("/search", searchRouter);
server.addOpenApiValidatorMiddleware();

server
  .boot()
  .then(async () => {
    await searchService.init();
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
