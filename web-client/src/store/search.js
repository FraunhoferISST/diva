const state = {
  term: "",
  result: [],
  filters: "",
  sort: "",
};

const SET_TERM = "SET_TERM";
const SET_RESULT = "SET_RESULT";
const SET_FILTERS = "SET_FILTERS";
const SET_SORT = "SET_SORT";

const mutations = {
  [SET_TERM](state, term) {
    state.term = term;
  },
  [SET_RESULT](state, result) {
    state.result = result;
  },
  [SET_FILTERS](state, filters) {
    state.filters = filters;
  },
  [SET_SORT](state, sort) {
    state.sort = sort;
  },
};

const actions = {
  setTerm({ commit }, term) {
    commit(SET_TERM, term);
  },
  setResult({ commit }, result) {
    commit(SET_RESULT, result);
  },
};

export default {
  state,
  mutations,
  actions,
};
