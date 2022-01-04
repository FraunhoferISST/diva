import debounce from "lodash.debounce";

const ENTITY_SUBSCRIBE_UPDATES_REQUEST = "entitySubscribeRequest";
// const ENTITY_SUBSCRIBE_UPDATES_RESPONSE = "entitySubscribeResponse";
const ENTITY_UNSUBSCRIBE_UPDATES_REQUEST = "entityUnsubscribeRequest";
// const ENTITY_UNSUBSCRIBE_UPDATES_RESPONSE = "entityUnsubscribeResponse";
const ENTITY_UPDATES_EVENT = "entityEvent";
const eventToHandlerMap = {
  update: "onUpdateEvent",
  delete: "onDeleteEvent",
};

export default {
  name: "EntityUpdateEvents",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  sockets: {
    /*[ENTITY_SUBSCRIBE_UPDATES_RESPONSE](data) {
      console.log(data);
    },*/
    [ENTITY_UPDATES_EVENT](data) {
      if (this.id === data?.object?.id) {
        const handler = eventToHandlerMap[data.type ?? "update"];
        debounce(() => this[handler](data), 2000, {
          leading: true,
        })();
      }
    },
  },
  methods: {
    onUpdateEvent() {
      // override this method in the component
    },
    onDeleteEvent() {
      // override this method in the component
    },
  },
  created() {
    this.$socket.emit(ENTITY_SUBSCRIBE_UPDATES_REQUEST, this.id);
  },
  destroyed() {
    this.$socket.emit(ENTITY_UNSUBSCRIBE_UPDATES_REQUEST, this.id);
  },
};
