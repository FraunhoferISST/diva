const boot = require("./server");
const analyticsRouter = require("./routes/analytics");
const GlobalAnalyticsService = require("./services/AnalyticsService");

boot((app) => {
  app.use("/analytics", analyticsRouter);
  return GlobalAnalyticsService.init();
});
