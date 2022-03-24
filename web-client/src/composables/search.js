import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { ref } from "@vue/composition-api";

export const useSearch = () => {
  const { search: searchCall } = useApi();
  const { request, loading, error } = useRequest();
  const data = ref(null);
  const search = (q, pageSize = 30, cursor) =>
    request(
      searchCall(q, pageSize, cursor).then(
        ({ data: result }) => (data.value = result)
      )
    );

  return {
    data,
    search,
    loading,
    error,
  };
};
