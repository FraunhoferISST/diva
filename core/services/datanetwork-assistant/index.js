const boot = require("@diva/common/api/expressServer");
const edgesRouter = require("./routes/edges");
const datanetworkService = require("./services/DatanetworkService");
const eventsHandlerService = require("./services/EventsHandlerService");

const port = process.env.PORT || 3012;

boot(
  async (app) => {
    app.use("/", edgesRouter);
    await eventsHandlerService.init();
    return datanetworkService.init();
  },
  { port }
);
