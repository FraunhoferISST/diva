import pluralize from "pluralize";
import api from "@/api/index";
import entityTypeById from "@/utils/entityTypeById";

const buildImageUrl = (collectionName, entityId, imageId = "") =>
  `${api.endpoint}/${collectionName}/${entityId}/images/${imageId}`;

export const useApi = (id = null) => {
  let entityApi = null;
  let entityCollection = null;
  let imageUrl = null;
  if (id) {
    entityCollection = pluralize(entityTypeById(id));
    entityApi = api[entityCollection];
    imageUrl = buildImageUrl(entityCollection, id);
  }
  const getEntityApiById = (entityId) =>
    api[pluralize(entityTypeById(entityId))];
  return {
    entityApi,
    entityCollection,
    imageUrl,
    buildImageUrl,
    getEntityApiById,
    ...api,
  };
};
