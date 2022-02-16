const searchService = require("../services/SearchService");

class SearchController {
  async searchAll(req, res, next) {
    try {
      const result = await searchService.searchAll(req.query);
      res.status(200).send(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new SearchController();
