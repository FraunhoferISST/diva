const boot = require("./server");
const searchRouter = require("./routes/search");
const SearchService = require("./services/SearchService");

boot((app) => {
  app.use("/search", searchRouter);
  return SearchService.init();
});
