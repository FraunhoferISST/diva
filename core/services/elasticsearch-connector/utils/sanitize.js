const buildEsGeoShape = (entity) => {
  if (typeof entity.location !== "undefined") {
    return {
      ...entity,
      location: {
        type: "geometrycollection",
        geometries: entity.location.features.map((f) => f.geometry),
      },
    };
  }

  return entity;
};

const sanitizeIndexBody = (entity) => buildEsGeoShape(entity);

module.exports = {
  sanitizeIndexBody,
};
