import apiFactory from "@/api/apiFactory";
import axios from "@/api/axios";

export default {
  ...apiFactory("/assets/"),
  getEntities: (id, query) =>
    axios.get(`/assets/${id}/entities/`, {
      params: query,
    }),
  addEntities: (id, entities) => axios.put(`/assets/${id}/entities/`, entities),
  deleteEntity: (id, entityId) =>
    axios.delete(`/assets/${id}/entities/${entityId}`),
};
