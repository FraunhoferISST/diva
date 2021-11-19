const boot = require("@diva/common/api/expressServer");
const edgesRouter = require("./routes/edges");
const datanetworkService = require("./services/DatanetworkService");

const port = process.env.PORT || 3013;

boot(
  (app) => {
    app.use("/datanetwork", edgesRouter);
    return datanetworkService.init();
  },
  { port }
);
