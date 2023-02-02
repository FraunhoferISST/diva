const buildEsGeoShape = (entity) => {
  if (entity?.location) {
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

const removeDestroyClaimPayload = (entity) => {
  if (entity?.destroyclaimExtensionPayload) {
    const tmp = entity;
    delete tmp.destroyclaimExtensionPayload;
    return {
      ...tmp,
    };
  }

  return entity;
};

const sanitizeIndexBody = (entity) => {
  let tmp = entity;
  tmp = buildEsGeoShape(entity);
  tmp = removeDestroyClaimPayload(entity);
  return tmp;
};

module.exports = {
  sanitizeIndexBody,
};
