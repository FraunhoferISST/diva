import Keycloak from "keycloak-js";
import api from "@/api/index";

let initOptions = {
  url: process.env.VUE_APP_KEYCLOAK_URL || "http://172.17.0.1:7000/auth",
  realm: process.env.VUE_APP_KEYCLOAK_REALM || "diva-kc-realm",
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID || "diva-kc-client",
};

let kc = Keycloak(initOptions);

const getUser = () => ({
  id: `user:uuid:${kc.tokenParsed.sub}`,
  username: kc.tokenParsed.email.split("@")[0],
  email: kc.tokenParsed.email,
  roles: kc.tokenParsed.realm_access.roles,
  groups: kc.tokenParsed.groups,
  token: kc.token,
});

const updateToken = () =>
  kc.updateToken(60).then((refreshed) => {
    if (refreshed) {
      api.setAuthorization(kc.token);
      localStorage.setItem("jwt", kc.token);
    }
  });

export default {
  kc,
  login: () => kc.login({ redirectUri: window.location.origin }),
  register: () => kc.register({ redirectUri: window.location.origin }),
  logout: kc.logout,
  verifyToken: kc.isTokenExpired,
  init: () =>
    kc
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: window.location.href,
      })
      .then((authenticated) => {
        setInterval(() => updateToken(), 60000);
        return authenticated;
      }),
  getUser,
  updateToken,
};
