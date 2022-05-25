const state = {
  edit_mode: false,
  route_loading: false,
};

const EDIT_MODE_ON = "EDIT_MODE_ON";
const EDIT_MODE_OFF = "EDIT_MODE_OFF";
const ROUTE_IS_LOADING = "ROUTE_IS_LOADING";
const ROUTE_IS_DONE = "ROUTE_IS_DONE";

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
};

export default {
  state,
  mutations,
  actions,
};
