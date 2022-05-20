import http from "@/api/http";
const axios = http.axios;
export default {
  import: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post("/divaLakeAdapter/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
