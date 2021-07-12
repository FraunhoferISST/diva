const boot = require("./server");
const adapterRouter = require("./routes/adapter");

boot((app) => {
  app.use("/", adapterRouter);
});
