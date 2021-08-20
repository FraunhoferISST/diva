const boot = require("@diva/common/api/expressServer");
const analyticsRouter = require("./routes/analytics");
const GlobalAnalyticsService = require("./services/AnalyticsService");

const port = process.env.PORT || 3007;

boot(
  (app) => {
    app.use("/analytics", analyticsRouter);
    return GlobalAnalyticsService.init();
  },
  { port }
);
