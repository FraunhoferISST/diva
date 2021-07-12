const SearchService = require("../services/SearchService");

class SearchController {
  async searchAll(req, res, next) {
    try {
      const result = await SearchService.searchAll(req.query);
      res.status(200).send(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new SearchController();
