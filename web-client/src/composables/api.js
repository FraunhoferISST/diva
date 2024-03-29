import pluralize from "pluralize";
import urlJoin from "url-join";
import api from "@/api/index";
import entityTypeById from "@/utils/entityTypeById";

const buildImageUrl = (collectionName, entityId, imageId = "") =>
  urlJoin(
    `${api.endpoint}`,
    `/${collectionName}/${entityId}/images/${imageId}`
  );

export const useApi = (id = null) => {
  let entityApi = null;
  let entityCollection = null;
  let imageUrl = null;
  const getEntityApiById = (entityId) => api[getCollectionNameById(entityId)];
  const getCollectionNameById = (entityId) =>
    pluralize(entityTypeById(entityId));
  if (id) {
    entityCollection = getCollectionNameById(id);
    entityApi = api[entityCollection];
    imageUrl = buildImageUrl(entityCollection, id);
  }
  return {
    api,
    entityApi,
    entityCollection,
    imageUrl,
    ...api,
    buildImageUrl,
    getEntityApiById,
    getCollectionNameById,
  };
};
