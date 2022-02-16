const buildEsGeoShape = (entity) => {
  if (entity.location) {
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
