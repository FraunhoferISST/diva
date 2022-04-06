import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { ref } from "@vue/composition-api";

export const useSchema = () => {
  const schema = ref(null);
  const { request, loading, error } = useRequest();
  const { schemata } = useApi();
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
    load,
    loading,
    error,
  };
};
