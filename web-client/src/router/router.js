import Vue from "vue";
import store from "@/store";
import Router from "vue-router";

import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Search from "@/views/Search.vue";

import entities from "@/router/entities";
import create from "@/router/create";
import dashboard from "@/router/dashboard";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      redirect: {
        name: "search",
      },
      children: [
        {
          path: "search",
          name: "search",
          component: Search,
        },
        create,
        ...entities,
        dashboard,
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
  ],
  mode: "history",
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    store.dispatch("routeIsLoading");
  }
  next();
});

router.afterEach(() => {
  setTimeout(() => {
    store.dispatch("routeIsDone");
  }, 1000);
});
export default router;
