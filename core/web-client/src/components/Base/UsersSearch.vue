<script>
export default {
  name: "UsersSearch",
  data: () => ({
    loading: false,
    error: "",
    users: [],
  }),
  methods: {
    searchUsers(term) {
      if (!term) return;
      this.loading = true;
      this.$api
        .search(term)
        .then(({ data: { collection } }) => {
          this.users = collection
            .filter(({ doc }) => doc.entityType === "user")
            .map(({ doc }) => doc);
        })
        .catch((e) => (this.error = e.message || "Somme error occurred"))
        .finally(() => (this.loading = false));
    },
  },
  render() {
    return this.$scopedSlots.default({
      search: this.searchUsers,
      users: this.users,
      loading: this.loading,
      error: this.error,
    });
  },
};
</script>

<style scoped></style>
