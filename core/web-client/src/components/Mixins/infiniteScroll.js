export default {
  name: "InfiniteScroll",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  methods: {
    loadPage(observerState, promise) {
      observerState.loading = true;
      observerState.error = false;
      observerState.completed = false;
      return promise
        .then(({ collection, cursor }) => {
          if (!cursor || collection.length === 0) {
            observerState.completed = true;
          }
          return { collection, cursor };
        })
        .catch(() => {
          observerState.error = true;
        })
        .finally(() => {
          observerState.loading = false;
        });
    },
  },
};
