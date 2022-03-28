import api from "@/api/index";

const user = {
  email: "",
  username: "",
  entityIcon: "",
  entityImages: [],
  created: "",
  modified: "",
  entityType: "user",
  creatorId: "",
  id: "",
  isLoggedIn: !!localStorage.getItem("jwt"),
  recentlyViewed: [],
};
const state = {
  ...user,
};

const SET_USER = "SET_USER";
const ADD_RECENTLY_VIEWED = "ADD_RECENTLY_VIEWED";

const LOGOUT = "LOGOUT";

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
  [ADD_RECENTLY_VIEWED](
    state,
    { id, title, username, entityType, entityIcon, mimeType }
  ) {
    state.recentlyViewed = [
      { id, title, username, entityType, entityIcon, mimeType },
      ...state.recentlyViewed,
    ]
      .filter(({ id }, i, self) =>
        self.every((en, n) => (i !== n ? id !== en.id : true))
      )
      .slice(0, 5);
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
  addRecentlyViewed({ commit }, entity) {
    commit(ADD_RECENTLY_VIEWED, entity);
  },
  refreshToken({ commit }, token) {
    setAuthorizationData(token);
    this._vm.$socket.io.opts.query = `jwt=${token}`;
    this._vm.$socket.open();
    commit(SET_USER, {});
  },
  async login({ commit }, { id, email, username, token }) {
    resetAuthorizationData();
    setAuthorizationData(token);
    // this._vm.$socket.io.opts.query = `jwt=${token}`;
    // this._vm.$socket.open();
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
