import entityTypeById from "@/utils/entityTypeById";
import api from "@/api/index";
export default (entityId, imageId = "") =>
  `${api.endpoint}/${entityTypeById(entityId)}s/${entityId}/images/${imageId}`;
