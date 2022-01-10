const boot = require("@diva/common/api/expressServer");
const path = require("path");
const schemaService = require("./services/SchemaService");
const schemaRouter = require("./routes/schemata");

const port = process.env.PORT || "3010";

boot(
  (app) => {
    app.use("/", schemaRouter);
    return schemaService.init();
  },
  { port, openapiPath: path.join(__dirname, "/apiDoc/openapi.yml") }
);
