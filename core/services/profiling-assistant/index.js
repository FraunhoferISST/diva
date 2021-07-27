const boot = require("@diva/common/api/expressServer");
const profilingRouter = require("./routes/profiling");
const profilingService = require("./services/ProfilingService");

const port = process.env.PORT || 3011;

boot(
  (app) => {
    app.use("/profiling", profilingRouter);
    return profilingService.init();
  },
  { port }
);
