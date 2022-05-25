import http from "@/api/http";
const axios = http.axios;
export default {
  import: (data, query) =>
    axios.post("/urbanPulseAdapter/import", data, { params: query }),
};
