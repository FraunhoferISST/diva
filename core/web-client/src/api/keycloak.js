import Keycloak from "keycloak-js";
import store from "@/store";

let initOptions = {
  url: process.env.VUE_APP_KEYCLOAK_URL || "http://172.17.0.1:7000/auth",
  realm: process.env.VUE_APP_KEYCLOAK_REALM || "diva-kc-realm",
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID || "diva-kc-client",
  onLoad: "check-sso",
  checkLoginIframe: false,
  silentCheckSsoRedirectUri: window.location.href,
};

let kc = Keycloak(initOptions);

const getUser = () => ({
  id: `user:uuid:${kc.tokenParsed.sub}`,
  username: kc.tokenParsed.email,
  email: kc.tokenParsed.email,
  token: kc.token,
});

export default {
  kc,
  login: kc.login,
  register: kc.register,
  logout: kc.logout,
  verifyToken: kc.isTokenExpired,
  init: () =>
    kc.init({ onLoad: initOptions.onLoad }).then((authenticated) => {
      setInterval(() => {
        kc.updateToken(0).then((refreshed) => {
          if (refreshed) {
            store.dispatch("refreshToken", kc.token);
          }
        });
      }, 10 ** 5);
      return authenticated;
    }),
  getUser,
};
