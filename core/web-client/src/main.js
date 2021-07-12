import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "vue2vis/dist/vue2vis.css";
import { i18n } from "@/plugins/i18n";
import VueEllipseProgress from "vue-ellipse-progress";
import vuetify from "./plugins/vuetify";
import api from "@/api/index";

Vue.use(VueEllipseProgress);

Vue.config.productionTip = false;
Vue.prototype.$api = api;

new Vue({
  created() {},
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
