const boot = require("@diva/common/api/expressServer");
const path = require("path");
const { buildInMemoryDb } = require("./db-keyv-engine");
const schemaRouter = require("./routes/schemata");

const port = process.env.PORT || "3010";

boot(
  (app) => {
    app.use("/schemata", schemaRouter);
    return buildInMemoryDb();
  },
  { port, openapiPath: path.join(__dirname, "/apiDoc/openapi.yml") }
);
