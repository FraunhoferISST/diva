import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { ref } from "@vue/composition-api";

export const useSearch = () => {
  const { search: searchCall } = useApi();
  const { request, loading, error } = useRequest();
  const data = ref(null);
  const _cursor = ref(null);
  const _total = ref(null);
  const _q = ref("");
  const _pageSize = ref(30);
  const _params = ref({});
  const search = (
    q,
    { pageSize = 30, cursor = _cursor.value, ...params } = {}
  ) =>
    request(
      searchCall(q, { pageSize, cursor, ...params }).then(
        ({ data: { collection, cursor, total, facets } }) => {
          data.value = { collection, cursor, total, facets };
          _cursor.value = cursor;
          _total.value = total;
          _q.value = q;
          _pageSize.value = pageSize;
          _params.value = params ?? {};
          return data.value;
        }
      )
    );
  const loadNextPage = (cursor = _cursor.value) =>
    request(
      searchCall(_q.value, {
        pageSize: _pageSize.value,
        cursor,
        ..._params.value,
      }).then(({ data: { collection, cursor, total, facets } }) => {
        data.value = {
          collection: [...data.value.collection, ...collection],
          cursor,
          total,
          facets,
        };
        _cursor.value = cursor;
        return data.value;
      })
    );

  return {
    data,
    loading,
    error,
    cursor: _cursor,
    total: _total,
    search,
    loadNextPage,
  };
};
