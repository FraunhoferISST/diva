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
  localStorage.setItem("jwt", "");
};

const actions = {
  setUser({ commit }, userData) {
    commit(SET_USER, userData);
  },
  async login({ commit }, { id, email, username, token }) {
    debugger;
    resetAuthorizationData();
    api.axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("jwt", token);
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
  verify({ commit }) {
    return api.users.verify().then(({ data }) => {
      const { email, username, imageId, imageURL, created, id } = data;
      if (this._vm.$socket.disconnected) {
        this._vm.$socket.open();
      }
      commit(SET_USER, {
        email,
        username,
        imageURL,
        created,
        imageId,
        id,
        isLoggedIn: true,
      });
      return data;
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
