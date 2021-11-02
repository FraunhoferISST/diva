import Vue from "vue";
import Vuetify from "vuetify/lib";
import IdsIcon from "@/components/Base/IdsIcon.vue";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    success: "#009374",
    primary: "#2d97fc",
  },
  icons: {
    iconfont: "md",
    values: {
      ids: {
        component: IdsIcon,
        props: {
          name: "ids",
        },
      },
    },
  },
});
