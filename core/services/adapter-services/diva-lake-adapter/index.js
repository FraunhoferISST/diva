const boot = require("@diva/common/api/expressServer");
const adapterRouter = require("./routes/adapter");
const divaLakeService = require("./services/DivaLakeService");
const eventsHandlerService = require("./services/EventsHandlerService");

const port = process.env.PORT || 4001;

boot(
  (app) => {
    app.use("/", adapterRouter);
    return Promise.all([divaLakeService.init(), eventsHandlerService.init()]);
  },
  { port }
);
