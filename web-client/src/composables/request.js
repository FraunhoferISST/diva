import { ref } from "@vue/composition-api";

export const useRequest = () => {
  const data = ref(null);
  const error = ref(false);
  const loading = ref(false);
  const request = (promise) => {
    error.value = null;
    loading.value = false;
    return promise
      .then(({ data: response }) => {
        data.value = response;
        return data.value;
      })
      .catch((e) => (error.value = e))
      .finally(() => (loading.value = false));
  };
  return {
    request,
    data,
    loading,
    error,
  };
};
