<script>
export default {
  name: "BaseDataFetcher",
  props: {
    fetchMethod: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    loading: true,
    updating: false,
    error: false,
    errorMessage: "",
  }),
  methods: {
    runFetchMethod() {
      this.updating = true;
      this.fetchMethod(...arguments)
        .catch((e) => {
          this.errorMessage = e?.response?.data?.message;
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
          this.updating = false;
        });
    },
  },
  async mounted() {
    this.runFetchMethod();
  },
  render() {
    return this.$scopedSlots.default({
      fetch: this.runFetchMethod,
      loading: this.loading,
      updating: this.updating,
      error: this.error,
      errorMessage: this.errorMessage,
    });
  },
};
</script>

<style scoped></style>
