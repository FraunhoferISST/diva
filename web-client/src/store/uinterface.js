const state = {
  search_filter_drawer: false,
  show_toolbar: false,
  edit_mode: false,
  route_loading: false,
  subNav: !!localStorage.getItem("subNav"),
};

const EDIT_MODE_ON = "EDIT_MODE_ON";
const EDIT_MODE_OFF = "EDIT_MODE_OFF";
const ROUTE_IS_LOADING = "ROUTE_IS_LOADING";
const ROUTE_IS_DONE = "ROUTE_IS_DONE";
const SET_SUB_NAV_OPEN = "SET_SUB_NAV_OPEN";
const SET_SUB_NAV_CLOSED = "SET_SUB_NAV_CLOSED";

const mutations = {
  [EDIT_MODE_ON](state) {
    state.edit_mode = true;
  },
  [EDIT_MODE_OFF](state) {
    state.edit_mode = false;
  },
  [ROUTE_IS_LOADING](state) {
    state.route_loading = true;
  },
  [ROUTE_IS_DONE](state) {
    state.route_loading = false;
  },
  [SET_SUB_NAV_OPEN](state) {
    state.subNav = true;
    localStorage.setItem("subNav", "open");
  },
  [SET_SUB_NAV_CLOSED](state) {
    state.subNav = false;
    localStorage.setItem("subNav", "");
  },
};

const actions = {
  editModeOn({ commit }) {
    commit(EDIT_MODE_ON);
  },
  editModeOff({ commit }) {
    commit(EDIT_MODE_OFF);
  },
  routeIsLoading({ commit }) {
    commit(ROUTE_IS_LOADING);
  },
  routeIsDone({ commit }) {
    commit(ROUTE_IS_DONE);
  },
  openSubNav({ commit }) {
    commit(SET_SUB_NAV_OPEN);
  },
  closeSubNav({ commit }) {
    commit(SET_SUB_NAV_CLOSED);
  },
};

export default {
  state,
  mutations,
  actions,
};
