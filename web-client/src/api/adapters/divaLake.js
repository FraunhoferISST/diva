import axios from "@/api/http";
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
