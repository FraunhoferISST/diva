import axios from "@/api/axios";
export default {
  import: (data) => axios.post("/urbanPulseAdapter/import", data),
};
