import axios from "@/api/axios";
import apiFactory from "@/api/apiFactory";
export default {
  ...apiFactory("/users/"),
  uploadImage: (image) => {
    const formData = new FormData();
    formData.append("image", image);
    return axios.post("userImages/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateImage: (imageId, image) => {
    const formData = new FormData();
    formData.append("image", image);
    return axios.put(`userImages/${imageId}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteImage: (imageId) => axios.delete(`userImages/${imageId}/`),
};
