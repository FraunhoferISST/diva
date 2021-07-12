import Vue from "vue";
import Vuex from "vuex";
import ui from "./store/uinterface";
import user from "./store/user";
import search from "./store/search";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ui,
    user,
    search,
  },
});
