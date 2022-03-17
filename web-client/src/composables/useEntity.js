import {
  ref,
  unref,
  computed,
  onMounted,
  onUnmounted,
} from "@vue/composition-api";
import entityTypeById from "@/utils/entityTypeById";
import api from "@/api/index";

const ENTITY_SUBSCRIBE_UPDATES_REQUEST = "entitySubscribeRequest";
// const ENTITY_SUBSCRIBE_UPDATES_RESPONSE = "entitySubscribeResponse";
const ENTITY_UNSUBSCRIBE_UPDATES_REQUEST = "entityUnsubscribeRequest";
// const ENTITY_UNSUBSCRIBE_UPDATES_RESPONSE = "entityUnsubscribeResponse";
const ENTITY_UPDATES_EVENT = "entityEvent";

export function useEntity(
  id,
  { reactive = false, updateInstantly = true, onUpdate = null } = {}
) {
  const entityCollection = `${entityTypeById(unref(id))}s`;
  const entityApi = api[entityCollection];
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const patchLoading = ref(false);
  const deleteLoading = ref(false);
  const updating = ref(false);

  const title = computed(() => data?.title || data?.username);

  const onUpdateEvent = async (data) => {
    updating.value = true;
    if (updateInstantly) {
      load().then(() => (updating.value = false));
    }
    const actorId = data?.actor.id;
    let actor = {};
    const entityType = entityTypeById(data?.object?.id) ?? "entity";
    const action = `${data.type ?? "update"}d`;
    let message = "";
    if (actorId === "TEST") {
      message = `You ${action} this ${entityType}`;
    } else if (actorId) {
      actor = await api.users
        .getByIdIfExists(id)
        .then((response) => response?.data);
      message = `${
        actor?.username || "N/A"
      } ${action} this ${entityType} just now`;
    } else {
      message = `${entityType} ${action}`;
    }
    if (onUpdate) {
      return onUpdate(
        onUpdate({
          event: data,
          actor,
          actorId,
          action,
          message,
        })
      );
    }
  };
  if (reactive) {
    onMounted(() => {
      api.socket.emit(ENTITY_SUBSCRIBE_UPDATES_REQUEST, id);
      api.socket.on(ENTITY_UPDATES_EVENT, onUpdateEvent);
    });
    onUnmounted(() => api.socket.emit(ENTITY_UNSUBSCRIBE_UPDATES_REQUEST, id));
  }

  const load = (query = {}) => {
    loading.value = true;
    return entityApi
      .getById(unref(id), query)
      .then(({ data: response }) => (data.value = response))
      .catch((e) => (error.value = e))
      .finally(() => (loading.value = false));
  };
  const patch = (patch, updateData = false) => {
    patchLoading.value = true;
    return entityApi
      .patch(unref(id), patch)
      .then(() => {
        if (updateData) {
          data.value = ref({ ...data.value, ...patch });
        }
      })
      .catch((e) => (error.value = e))
      .finally(() => (patchLoading.value = false));
  };
  const deleteEntity = () => {
    deleteLoading.value = true;
    return entityApi
      .patch(unref(id), patch)
      .catch((e) => (error.value = e))
      .finally(() => (deleteLoading.value = false));
  };
  return {
    load,
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
  };
}
