const boot = require("./server");
const historiesRouter = require("./routes/histories");
const { loadSchemas } = require("./utils/validation/jsonSchemaValidation");
const { db } = require("./utils/database");

boot((app) => {
  app.use("/histories", historiesRouter);

  return Promise.all([db.connect(), loadSchemas()]);
});
