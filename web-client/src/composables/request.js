import { ref } from "@vue/composition-api";

export const useRequest = () => {
  const error = ref(false);
  const loading = ref(false);
  const request = (promise) => {
    error.value = null;
    loading.value = true;
    return promise
      .catch((e) => (error.value = e))
      .finally(() => (loading.value = false));
  };
  return {
    request,
    loading,
    error,
  };
};
