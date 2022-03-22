import { ref, computed } from "@vue/composition-api";
import entityTypeById from "@/utils/entityTypeById";
import { useEvents } from "@/composables/events";
import { useUser } from "@/composables/user";
import api from "@/api/index";

export function useEntity(
  id,
  { reactive = false, updateInstantly = false, onEvent = null } = {}
) {
  const entityCollection = `${entityTypeById(id)}s`;
  const entityApi = api[entityCollection];
  const data = ref(null);
  const eventData = ref();
  const error = ref(null);
  const loading = ref(false);
  const patchLoading = ref(false);
  const deleteLoading = ref(false);
  const updating = ref(false);
  const _query = ref({});

  const title = computed(() => data?.title || data?.username);

  if (reactive) {
    const { user } = useUser();
    const { data: _eventData } = useEvents(id, user.value.id, async () => {
      eventData.value = _eventData.value;
      updating.value = true;
      if (updateInstantly || user.value.id === _eventData.value.actorId) {
        await reload(_query.value)
          .catch()
          .finally(() => (updating.value = false));
      }
      if (onEvent) {
        onEvent(_eventData.value);
      }
      updating.value = false;
    });
  }

  const load = (query = {}) => {
    loading.value = true;
    _query.value = query;
    return entityApi
      .getById(id, _query.value)
      .then(({ data: response }) => (data.value = response))
      .catch((e) => (error.value = e))
      .finally(() => (loading.value = false));
  };
  const reload = (query = null) => {
    updating.value = true;
    _query.value = query ? query : _query.value;
    return entityApi
      .getById(id, _query.value)
      .then(({ data: response }) => (data.value = response))
      .catch((e) => (error.value = e))
      .finally(() => (updating.value = false));
  };
  const patch = (patch, updateData = false) => {
    patchLoading.value = true;
    return entityApi
      .patch(id, patch)
      .then(() => {
        if (updateData) {
          data.value = { ...data.value, ...patch };
        }
      })
      .catch((e) => (error.value = e))
      .finally(() => (patchLoading.value = false));
  };
  const deleteEntity = () => {
    deleteLoading.value = true;
    return entityApi
      .patch(id, patch)
      .catch((e) => (error.value = e))
      .finally(() => (deleteLoading.value = false));
  };
  return {
    load,
    reload,
    patch,
    deleteEntity,
    patchLoading,
    deleteLoading,
    loading,
    error,
    data,
    entityCollection,
    entityApi,
    title,
    updating,
    eventData,
  };
}
