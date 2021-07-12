const boot = require("./server");
const profilingRouter = require("./routes/profiling");
const ProfilingService = require("./services/ProfilingService");

boot((app) => {
  app.use("/profiling", profilingRouter);
  return ProfilingService.init();
});
