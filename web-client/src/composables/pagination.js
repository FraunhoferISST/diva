import { ref } from "@vue/composition-api";
import { useRequest } from "@/composables/request";

export const usePagination = (getFirstPage, getNextPage) => {
  const { request, loading, error, data } = useRequest();
  const load = (promise) => request(promise);
  const reload = (promise) => request(promise);

  return {
    load,
    data,
    error,
  };
};
