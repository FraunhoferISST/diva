const boot = require("@diva/common/api/expressServer");
const searchRouter = require("./routes/search");
const SearchService = require("./services/SearchService");

const port = process.env.PORT || 3005;

boot(
  (app) => {
    app.use("/search", searchRouter);
    return SearchService.init();
  },
  { port }
);
