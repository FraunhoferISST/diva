const express = require("express");
const chalk = require("chalk");
const path = require("path");
const OpenApiValidator = require("express-openapi-validator");
const packageJson = require("./package.json");
const {
  createError,
  isOpenAPISpecValidationError,
  isCustomError,
  createOpenAPIValidationError,
} = require("./utils/errors");
const AssetService = require("./services/AssetService");
const messageProducer = require("./messageProducer/producer");
const { loadSchemas } = require("./utils/validation/jsonSchemaValidation");
const { loadAsyncAPISpec } = require("./utils/validation/messagesValidation");
const assetsRouter = require("./routes/assets");

const PORT = process.env.PORT || 3002;
const ACTOR_ID_HEADER = "x-actorid";

const notFoundHandler = (err, req, res, next) => {
  res.status(404).send();
  next(err);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (!res.headersSent) {
    if (isOpenAPISpecValidationError(err)) {
      return res.status(err.status).send(createOpenAPIValidationError(err));
    }
    if (!isCustomError(err)) {
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

  app.use(
    express.json({ type: ["application/json", "application/merge-patch+json"] })
  );
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    req.actorid = req.headers[ACTOR_ID_HEADER];
    return next();
  });

  app.use(
    OpenApiValidator.middleware({
      apiSpec: path.join(__dirname, "./apiDoc/openapi.yml"),
    })
  );

  // Routes
  app.use("/assets", assetsRouter);

  app.use(errorHandler);
  app.use(notFoundHandler);

  await Promise.all([
    AssetService.init(),
    messageProducer.init(),
    loadSchemas(),
    loadAsyncAPISpec(),
  ]);

  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.info(chalk.blue(`✅ REST API ready at port ${PORT} 🌐`));
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
