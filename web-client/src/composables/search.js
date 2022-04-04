import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { ref } from "@vue/composition-api";

export const useSearch = () => {
  const { search: searchCall } = useApi();
  const { request, loading, error } = useRequest();
  const data = ref(null);
  const _cursor = ref(null);
  const _total = ref(null);
  const search = (q, { pageSize = 30, cursor = _cursor.value, ...params }) =>
    request(
      searchCall(q, { pageSize, cursor, ...params }).then(
        ({ data: { collection, cursor, total } }) => {
          data.value = { collection, cursor, total };
          _cursor.value = cursor;
          _total.value = total;
          return data.value;
        }
      )
    );

  return {
    data,
    search,
    loading,
    error,
    cursor: _cursor,
    total: _total,
  };
};
