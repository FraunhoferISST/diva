import http from "@/api/http";
const axios = http.axios;

export default {
  getEdges: (query = {}) => axios.get("/edges", { params: query }),
  putEdge: (data) => axios.put("/edges", data),
  deleteEdgeById: (id) => axios.delete(`/edges/${id}`),
};
