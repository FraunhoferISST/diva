import { ref } from "@vue/composition-api";

export const useSnackbar = () => {
  const snackbar = ref(false);
  const message = ref("");
  const _color = ref("success");
  const _timeout = ref(6000);
  const show = (msg, { color = "success", timeout = 6000 } = {}) => {
    _color.value = color;
    _timeout.value = timeout;
    message.value = msg;
    snackbar.value = true;
  };
  const close = () => (snackbar.value = false);
  return {
    snackbar,
    color: _color,
    timeout: _timeout,
    show,
    close,
    message,
  };
};
