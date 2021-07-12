import axios from "@/api/axios";

export default {
  getHistories: (query = {}) => axios.get("/histories", { params: query }),
  getHistoryById: (id) => axios.get(`/histories/${id}`),
};
