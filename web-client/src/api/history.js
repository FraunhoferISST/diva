import http from "@/api/http";
const axios = http.axios;
export default {
  getHistories: (query = {}) => axios.get("/histories", { params: query }),
  getHistoryById: (id) => axios.get(`/histories/${id}`),
};
