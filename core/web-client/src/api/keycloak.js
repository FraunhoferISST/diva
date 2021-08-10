import Keycloak from "keycloak-js";

let initOptions = {
  url: process.env.VUE_APP_KEYCLOAK_URL || "http://172.17.0.1:7000/auth",
  realm: process.env.VUE_APP_KEYCLOAK_REALM || "diva",
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID || "diva",
  onLoad: "check-sso",
  checkLoginIframe: false,
  silentCheckSsoRedirectUri: window.location.href,
};

let kc = Keycloak(initOptions);

const getUser = () => ({
  id: `user:uuid:${kc.tokenParsed.sub}`,
  username: kc.tokenParsed.name,
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
            console.info("Token refreshed" + refreshed);
          }
        });
      }, 10 ** 5);
      return authenticated;
    }),
  getUser,
};
