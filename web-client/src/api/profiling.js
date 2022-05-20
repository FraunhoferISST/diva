import http from "@/api/http";
const axios = http.axios;
export default {
  exists: (data) => axios.post("/profiling/exists", data),
  run: (data) => axios.post("/profiling/run", data),
};
