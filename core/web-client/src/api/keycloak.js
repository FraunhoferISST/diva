import Keycloak from "keycloak-js";

let initOptions = {
  url: process.env.VUE_APP_KEYCLOAK_URL || "http://localhost:7000/auth",
  realm: process.env.VUE_APP_KEYCLOAK_REALM || "diva",
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID || "diva",
  onLoad: "check-sso",
  checkLoginIframe: false,
  silentCheckSsoRedirectUri: window.location.href,
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJiOTA3ODY0Zi1mZDQ3LTQwNzQtOGRiMi0wZGY0M2QxMDRlMGIifQ.eyJleHAiOjAsImlhdCI6MTYyODUzOTQxNCwianRpIjoiODg4NTkwYmItNzFhNy00NWQ4LTg1OTktZWJmNjJmNDA1OGE0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo3MDAwL2F1dGgvcmVhbG1zL2RpdmEiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjcwMDAvYXV0aC9yZWFsbXMvZGl2YSIsInR5cCI6IlJlZ2lzdHJhdGlvbkFjY2Vzc1Rva2VuIiwicmVnaXN0cmF0aW9uX2F1dGgiOiJhdXRoZW50aWNhdGVkIn0.s08s7dj567L59mrn3YiM730sm9LBke6pWb93R21BQ5Y",
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
