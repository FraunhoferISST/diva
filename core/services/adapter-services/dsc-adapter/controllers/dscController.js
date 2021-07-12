const idsService = require("../services/DscAdapterService");

class DscController {
  async createOffer(req, res, next) {
    try {
      const result = await idsService.createOffer(
        req.params.id,
        req.body,
        req.headers["x-actorid"]
      );
      res.status(201).json(result);
    } catch (e) {
      next(e?.response?.data || e);
    }
  }

  async getOffer(req, res, next) {
    try {
      const result = await idsService.getOffer(req.params.offerId);
      res.status(200).json(result);
    } catch (e) {
      next(e?.response?.data || e);
    }
  }

  async updateOffer(req, res, next) {
    try {
      await idsService.updateOffer(
        req.params.id,
        req.params.offerId,
        req.body,
        req.headers["x-actorid"]
      );
      res.status(200).send();
    } catch (e) {
      next(e?.response?.data || e);
    }
  }

  async deleteOffer(req, res, next) {
    try {
      await idsService.deleteOffer(
        req.params.id,
        req.params.offerId,
        req.headers["x-actorid"]
      );
      res.status(200).send();
    } catch (e) {
      next(e?.response?.data || e);
    }
  }
}

module.exports = new DscController();
