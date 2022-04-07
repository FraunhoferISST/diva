import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { ref } from "@vue/composition-api";
import paginator from "@/utils/paginator";

export const useSchema = () => {
  const schema = ref(null);
  const { request, loading, error } = useRequest();
  const { schemata } = useApi();

  const getAllSchemata = async () => {
    loading.value = true;
    const allSchemata = [];
    try {
      for await (const { collection } of paginator(schemata.get)) {
        allSchemata.push(...collection);
      }
      return allSchemata;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const load = (scope) =>
    request(schemata.getScopedSchemata(scope)).then(
      ({ data: { collection } }) => {
        schema.value = Object.fromEntries(
          collection.map(({ schema: propSchema }) => {
            const parsedSchema = JSON.parse(propSchema);
            const propName = Object.keys(parsedSchema.properties)[0];
            return [propName, parsedSchema.properties[propName]];
          })
        );
      }
    );
  return {
    schema,
    loading,
    error,
    load,
    getAllSchemata,
  };
};
