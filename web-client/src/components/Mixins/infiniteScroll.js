export default {
  name: "InfiniteScroll",
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
    loadPageSync(observerState, getPageHandler) {
      observerState.loading = true;
      observerState.error = false;
      observerState.completed = false;
      try {
        getPageHandler();
      } catch {
        observerState.error = true;
      } finally {
        observerState.loading = false;
      }
    },
  },
};
