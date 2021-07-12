const chalk = require("chalk");
const path = require("path");
const express = require("express");
const OpenApiValidator = require("express-openapi-validator");
const packageJson = require("./package.json");
const { createError } = require("./errors");
const { buildInMemoryDb } = require("./db-keyv-engine");
const schemaRouter = require("./routes/schemata");

const PORT = process.env.PORT || "3010";

const notFoundHandler = (err, req, res, next) => {
  res.status(404).send();
  next(err);
};

const errorHandler = (err, req, res, next) => {
  if (!res.headersSent) {
    // TODO: request validator has no custom request error handler, create an issue!
    if (err.errors && err.status) {
      return res.status(err.status).send({
        ...createError({
          type: err.name,
          message: "Request violates API Specification",
          code: err.status,
        }),
        errors: err.errors,
      });
    }
    if (!err.code) {
      console.error(err);
      const unexpectedError = createError({ message: err.toString() });
      return res.status(unexpectedError.code).send(unexpectedError);
    }
    res.status(err.code).send(err);
  }
};

const boot = async () => {
  console.info(
    chalk.blue(
      `✅ Running ${packageJson.name}:${packageJson.version} in ${process.env.NODE_ENV} mode`
    )
  );

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    OpenApiValidator.middleware({
      apiSpec: path.join(__dirname, "apiDoc", "openapi.yml"),
    })
  );

  app.use("/schemata", schemaRouter);

  app.use(errorHandler);
  app.use(notFoundHandler);

  await buildInMemoryDb();

  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.info(chalk.blue(`✅ API ready at port ${PORT} 🌐`));
      resolve(app);
    });
  });
};

boot()
  .then(() =>
    console.info(chalk.blue(`✅ All components booted successfully 🚀`))
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
