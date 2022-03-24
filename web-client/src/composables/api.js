import api from "@/api/index";
import entityTypeById from "@/utils/entityTypeById";

export const useApi = (id = null) => {
  let entityApi = null;
  let entityCollection = null;
  if (id) {
    entityCollection = `${entityTypeById(id)}s`;
    entityApi = api[entityCollection];
  }
  return {
    entityApi,
    entityCollection,
    ...api,
  };
};
