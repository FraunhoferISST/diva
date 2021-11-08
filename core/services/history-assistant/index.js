const boot = require("@diva/common/api/expressServer");
const historiesRouter = require("./routes/histories");
const historiesService = require("./services/HistoriesService");
const eventsHandlerService = require("./services/EventsHandlerService");

const port = process.env.PORT || 3006;

boot(
  (app) => {
    app.use("/histories", historiesRouter);
    return Promise.all([historiesService.init(), eventsHandlerService.init()]);
  },
  { port }
);
