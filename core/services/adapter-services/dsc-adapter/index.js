const boot = require("@diva/common/api/expressServer");
const IDSService = require("./services/DscAdapterService");
const eventsHandlerService = require("./services/EventsHandlerService");
const adapterRouter = require("./routes/adapter");

const port = process.env.PORT || 4002;

boot(
  async (app) => {
    app.use("/resources", adapterRouter);
    await IDSService.init();
    await eventsHandlerService.init();
  },
  { port }
);
