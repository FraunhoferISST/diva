import axios from "@/api/axios";

export default {
  getEdges: (query = {}) => axios.get("/edges", { params: query }),
  putEdge: (data) => axios.get("/edges", data),
};
