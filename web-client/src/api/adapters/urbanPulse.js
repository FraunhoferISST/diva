import axios from "@/api/http";
export default {
  import: (data, query) =>
    axios.post("/urbanPulseAdapter/import", data, { params: query }),
};
