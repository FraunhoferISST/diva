import mitt from "mitt";
import { onUnmounted } from "@vue/composition-api";
const emitter = mitt();
export const useBus = () => {
  const on = (type, handler) => emitter.on(type, handler);
  const off = (type) => emitter.off(type);
  const emit = (type, data) => emitter.emit(type, data);

  onUnmounted(() => emitter.all.clear());
  return {
    on,
    off,
    emit,
  };
};
