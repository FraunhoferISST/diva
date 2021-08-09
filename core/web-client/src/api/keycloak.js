import Keycloak from "keycloak-js";

let initOptions = {
  url: process.env.VUE_APP_KEYCLOAK_URL || "http://localhost:7000/auth",
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
  init: () =>
    kc.init({ onLoad: initOptions.onLoad }).then((authenticated) => {
      //Token Refresh
      setInterval(() => {
        kc.updateToken(70).then((refreshed) => {
          if (refreshed) {
            console.info("Token refreshed" + refreshed);
          } else {
            console.warn(
              "Token not refreshed, valid for " +
                Math.round(
                  kc.tokenParsed.exp + kc.timeSkew - new Date().getTime() / 1000
                ) +
                " seconds"
            );
          }
        });
      }, 6000);
      return authenticated;
    }),
  getUser,
};
