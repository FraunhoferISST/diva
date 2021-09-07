const dscAdapterService = require("../services/DscAdapterService");

class DscController {
  async createOffer(req, res, next) {
    try {
      const result = await dscAdapterService.createOffer(
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
      const result = await dscAdapterService.getOffer(req.params.offerId);
      res.status(200).json(result);
    } catch (e) {
      next(e?.response?.data || e);
    }
  }

  async updateOffer(req, res, next) {
    try {
      await dscAdapterService.updateOffer(
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
      await dscAdapterService.deleteOffer(
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
