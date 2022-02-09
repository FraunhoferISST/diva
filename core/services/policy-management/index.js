const createServer = require("@diva/common/api/expressServer");
const policyDecisionController = require("./controllers/policyDecisionController");

// const policyCollectorRouter = require("./routes/policyCollector");
// const policyCollectorService = require("./services/policyCollectorService");
const policyDecisionRouter = require("./routes/policyDecision");
const policyDecisionService = require("./services/policyDecisionService");
const serviceName = require("./package.json").name;

const port = process.env.PORT || 3013;

module.exports = createServer(
  async (app) => {
    // TODO: extract image file, fix until https://github.com/cdimascio/express-openapi-validator/pull/464 resolved

    app.use("/decision", policyDecisionRouter);

    // await Promise.all([
    //   policyCollectorService.init(),
    // ]);
    return policyDecisionService.init();
  },
  { port }
);