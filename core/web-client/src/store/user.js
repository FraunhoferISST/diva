import api from "@/api/index";

const user = {
  email: "",
  username: "",
  imageId: "",
  imageURL: "",
  created: "",
  modified: "",
  entityType: "user",
  creatorId: "",
  id: "",
  isLoggedIn: !!localStorage.getItem("jwt"),
};
const state = {
  ...user,
};

const SET_USER = "SET_USER";

const LOGOUT = "LOGOUT";
const VERIFY = "VERIFY";

const mutations = {
  [SET_USER](state, userData) {
    for (const key in userData) {
      state[key] = userData[key];
    }
  },
  [LOGOUT](state) {
    for (const key in user) {
      state[key] = user[key];
    }
    state.isLoggedIn = false;
  },
  [VERIFY](state) {
    state.pending = true;
  },
};

const resetAuthorizationData = () => {
  api.axios.defaults.headers["Authorization"] = "";
  api.fetchWrapper.setAuthHeader("");
  localStorage.setItem("jwt", "");
};

const setAuthorizationData = (token) => {
  api.axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  api.fetchWrapper.setAuthHeader(token);
  localStorage.setItem("jwt", token);
};

const actions = {
  setUser({ commit }, userData) {
    commit(SET_USER, userData);
  },
  refreshToken({ commit }, token) {
    debugger;
    setAuthorizationData(token);
    this._vm.$socket.io.opts.query = `jwt=${token}`;
    this._vm.$socket.open();
    commit(SET_USER, {});
  },
  async login({ commit }, { id, email, username, token }) {
    resetAuthorizationData();
    setAuthorizationData(token);
    this._vm.$socket.io.opts.query = `jwt=${token}`;
    this._vm.$socket.open();
    await api.users.update(id, { email, username });
    return api.users.getById(id).then(({ data }) => {
      commit(SET_USER, {
        ...data,
        isLoggedIn: true,
      });
    });
  },
  logout({ commit }) {
    resetAuthorizationData();
    this._vm.$socket.close();
    commit(LOGOUT);
  },
};

export default {
  state,
  mutations,
  actions,
};
