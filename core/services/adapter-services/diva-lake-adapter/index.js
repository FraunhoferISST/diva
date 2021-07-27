const boot = require("@diva/common/api/expressServer");
const adapterRouter = require("./routes/adapter");

const port = process.env.PORT || 4001;

boot(
  (app) => {
    app.use("/", adapterRouter);
  },
  { port }
);
