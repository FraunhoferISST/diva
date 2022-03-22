const _ = require("lodash");
const hasha = require("hasha");
const jsondiffpatch = require("jsondiffpatch");
const generateUuid = require("./generateUuid");

const jdp = jsondiffpatch.create({
  objectHash(obj) {
    const newObj = _(obj).toPairs().sortBy(0).fromPairs().value();
    return hasha(JSON.stringify(newObj), { algorithm: "sha256" });
  },
  arrays: {
    detectMove: true,
    includeValueOnMove: false,
  },
  textDiff: {
    minLength: 60,
  },
  propertyFilter(name) {
    return name.slice(0, 1) !== "$";
  },
  cloneDiffValues: false,
});

const createPatchDelta = (oldObj, newObj) => jdp.diff(oldObj, newObj) || {};

const createHistoryEntity = (attributedToId, delta, actorId) => ({
  id: generateUuid("history"),
  created: new Date().toISOString(),
  modified: new Date().toISOString(),
  creatorId: actorId,
  entityType: "history",
  attributedTo: attributedToId,
  delta,
});
module.exports = {
  createHistoryEntity,
  createPatchDelta,
};
