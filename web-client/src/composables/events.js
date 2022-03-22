import { ref, onMounted, onUnmounted } from "@vue/composition-api";
import entityTypeById from "@/utils/entityTypeById";
import api from "@/api/index";

const ENTITY_SUBSCRIBE_UPDATES_REQUEST = "entitySubscribeRequest";
// const ENTITY_SUBSCRIBE_UPDATES_RESPONSE = "entitySubscribeResponse";
const ENTITY_UNSUBSCRIBE_UPDATES_REQUEST = "entityUnsubscribeRequest";
// const ENTITY_UNSUBSCRIBE_UPDATES_RESPONSE = "entityUnsubscribeResponse";
const ENTITY_UPDATES_EVENT = "entityEvent";

export function useEvents(id, userId, onEvent) {
  const data = ref(null);
  const loading = ref(false);

  const onUpdateEvent = async (eventData) => {
    loading.value = true;
    const actorId = eventData?.actor.id;
    let actor = {};
    const entityType = entityTypeById(eventData?.object?.id) ?? "entity";
    const action = `${eventData.type ?? "update"}d`;
    let message = "";
    if (actorId === userId) {
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
    loading.value = false;
    data.value = {
      eventData,
      actor: actor ?? {},
      actorId,
      action,
      message,
    };
    if (onEvent) {
      return onEvent(data.value);
    }
  };
  const subscribe = () => {
    api.socket.emit(ENTITY_SUBSCRIBE_UPDATES_REQUEST, id);
    api.socket.on(ENTITY_UPDATES_EVENT, onUpdateEvent);
  };
  const unsubscribe = () =>
    api.socket.emit(ENTITY_UNSUBSCRIBE_UPDATES_REQUEST, id);
  onMounted(() => {
    subscribe();
  });
  onUnmounted(() => unsubscribe());

  return {
    data,
    subscribe,
    unsubscribe,
  };
}
