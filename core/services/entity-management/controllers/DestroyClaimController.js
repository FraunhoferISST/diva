const destroyClaimService = require("../services/DestroyClaimsService");
const EntityController = require("./EntityController");

class DestroyClaimController extends EntityController {
  async getAndResolveById(req, res, next) {
    try {
      const resolvedDestroyClaim = await destroyClaimService.getAndResolveById(
        req.params.id
      );
      res.setHeader("Content-Type", "text/yaml");
      res.status(200).send(resolvedDestroyClaim);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new DestroyClaimController(destroyClaimService);
