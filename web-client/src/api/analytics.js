import http from "@/api/http";
const axios = http.axios;
export default {
  distributionOfEntities: () => axios.get("/analytics/distributionOfEntities"),
  distributionOfResourceMimeTypes: () =>
    axios.get("/analytics/distributionOfResourceMimeTypes"),
  distributionOfResourceTypes: () =>
    axios.get("/analytics/distributionOfResourceTypes"),
  averageRating: (id) => axios.get(`/analytics/entities/${id}/rating`),
};
