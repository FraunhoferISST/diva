import { ref } from "@vue/composition-api";

export const useSnackbar = () => {
  const snackbar = ref(false);
  const message = ref("");
  const c = ref("success");
  const t = ref(6000);
  const show = (msg, { color = "success", timeout = 6000 } = {}) => {
    c.value = color;
    t.value = timeout;
    message.value = msg;
    snackbar.value = true;
  };
  return {
    snackbar,
    c,
    t,
    show,
    message,
  };
};
