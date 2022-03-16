import entityTypeById from "@/utils/entityTypeById";
import { endpoint } from "@/api/axios";
export default (entityId, imageId = "") =>
  `${endpoint}/${entityTypeById(entityId)}s/${entityId}/images/${imageId}`;
