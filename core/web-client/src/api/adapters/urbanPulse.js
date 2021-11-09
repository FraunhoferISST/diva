import axios from "@/api/axios";
export default {
  import: (data, query) =>
    axios.post("/urbanPulseAdapter/import", data, { params: query }),
};
